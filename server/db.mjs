import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { seedAddOns, seedCategories, seedProducts, seedSizeOptions } from './seed.mjs';

const serverDirectory = dirname(fileURLToPath(import.meta.url));
const databasePath = resolve(
  process.env.SQLITE_DB_PATH || resolve(serverDirectory, '../data/brew-bean.sqlite'),
);
mkdirSync(dirname(databasePath), { recursive: true });

export const db = new DatabaseSync(databasePath);
db.exec(readFileSync(resolve(serverDirectory, 'schema.sql'), 'utf8'));

const productCount = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
if (productCount === 0) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const insertCategory = db.prepare('INSERT INTO categories (id, name) VALUES (?, ?)');
    for (const name of seedCategories) {
      insertCategory.run(name.toLowerCase(), name);
    }

    const insertAddOn = db.prepare(
      'INSERT INTO add_ons (id, name, price_cents) VALUES (?, ?, ?)',
    );
    for (const addOn of seedAddOns) {
      insertAddOn.run(addOn.id, addOn.name, Math.round(addOn.price * 100));
    }

    const insertProduct = db.prepare(`
      INSERT INTO products
        (id, category_id, name, price_cents, stock, tag, tag_color, image_url, default_size)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertDefaultAddOn = db.prepare(
      'INSERT INTO product_default_add_ons (product_id, add_on_id) VALUES (?, ?)',
    );
    for (const product of seedProducts) {
      insertProduct.run(
        product.id,
        product.category.toLowerCase(),
        product.name,
        Math.round(product.price * 100),
        product.stock,
        product.tag,
        product.tagColor,
        product.image,
        product.defaultSize,
      );
      for (const addOnId of product.defaultAddOns) {
        insertDefaultAddOn.run(product.id, addOnId);
      }
    }

    const insertSize = db.prepare(
      'INSERT INTO size_options (id, name, adjustment_cents) VALUES (?, ?, ?)',
    );
    for (const size of seedSizeOptions) {
      insertSize.run(size.id, size.name, Math.round(size.adjustment * 100));
    }

    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('tax_rate_percent', '15');
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('promo_discount_percent', '10');
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('currency', 'PHP');
    db.prepare('INSERT INTO order_number_sequence (id, next_number) VALUES (1, 1048)').run();
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

db.exec('BEGIN IMMEDIATE');
try {
  const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)');
  for (const name of seedCategories) {
    insertCategory.run(name.toLowerCase(), name);
  }
  const insertAddOn = db.prepare(
    'INSERT OR IGNORE INTO add_ons (id, name, price_cents) VALUES (?, ?, ?)',
  );
  const insertCategoryAddOn = db.prepare(
    'INSERT OR IGNORE INTO category_add_ons (category_id, add_on_id) VALUES (?, ?)',
  );
  for (const addOn of seedAddOns) {
    insertAddOn.run(addOn.id, addOn.name, Math.round(addOn.price * 100));
    for (const category of addOn.categories) {
      insertCategoryAddOn.run(category.toLowerCase(), addOn.id);
    }
  }
  db.exec('COMMIT');
} catch (error) {
  db.exec('ROLLBACK');
  throw error;
}

export function getProducts() {
  const defaultAddOns = db.prepare(`
    SELECT product_id, add_on_id
    FROM product_default_add_ons
  `).all();
  const defaultsByProduct = new Map();
  for (const row of defaultAddOns) {
    const current = defaultsByProduct.get(row.product_id) || [];
    current.push(row.add_on_id);
    defaultsByProduct.set(row.product_id, current);
  }

  return db.prepare(`
    SELECT
      products.id,
      products.name,
      categories.name AS category,
      products.price_cents,
      products.stock,
      products.tag,
      products.tag_color,
      products.image_url,
      products.default_size
    FROM products
    JOIN categories ON categories.id = products.category_id
    WHERE products.is_active = 1
    ORDER BY products.rowid
  `).all().map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price_cents / 100,
    stock: product.stock,
    tag: product.tag,
    tagColor: product.tag_color,
    image: product.image_url,
    defaultOptions: {
      size: product.default_size,
      addOns: defaultsByProduct.get(product.id) || [],
    },
  }));
}

export function getBootstrap() {
  const settings = Object.fromEntries(
    db.prepare('SELECT key, value FROM settings').all().map(({ key, value }) => [key, value]),
  );
  return {
    categories: db.prepare('SELECT name FROM categories ORDER BY rowid').all().map((row) => row.name),
    products: getProducts(),
    sizeOptions: db.prepare(`
      SELECT id, name, adjustment_cents
      FROM size_options
      ORDER BY rowid
    `).all().map((size) => ({
      id: size.id,
      name: size.name,
      adjustment: size.adjustment_cents / 100,
    })),
    addOns: db.prepare(`
      SELECT add_ons.id, add_ons.name, add_ons.price_cents, categories.name AS category
      FROM add_ons
      JOIN category_add_ons ON category_add_ons.add_on_id = add_ons.id
      JOIN categories ON categories.id = category_add_ons.category_id
      WHERE add_ons.is_active = 1
      ORDER BY add_ons.rowid
    `).all().map((addOn) => ({
      id: addOn.id,
      name: addOn.name,
      price: addOn.price_cents / 100,
      category: addOn.category,
    })),
    settings: {
      taxRatePercent: Number(settings.tax_rate_percent),
      promoDiscountPercent: Number(settings.promo_discount_percent),
      currency: settings.currency,
    },
    nextOrderNumber: db.prepare(
      'SELECT next_number FROM order_number_sequence WHERE id = 1',
    ).get().next_number,
  };
}

export function getOrders(limit = 50) {
  return db.prepare(`
    SELECT
      orders.id,
      orders.order_type AS orderType,
      orders.customer_type AS customerType,
      orders.status,
      orders.payment_status AS paymentStatus,
      orders.promo_code AS promoCode,
      orders.subtotal_cents AS subtotalCents,
      orders.discount_cents AS discountCents,
      orders.tax_cents AS taxCents,
      orders.total_cents AS totalCents,
      orders.currency,
      orders.created_at AS createdAt,
      payments.method AS paymentMethod,
      payments.amount_cents AS amountPaidCents,
      delivery_orders.app_name AS deliveryApp,
      delivery_orders.external_order_number AS deliveryOrderNumber,
      COALESCE(SUM(order_items.quantity), 0) AS itemCount
    FROM orders
    LEFT JOIN payments ON payments.order_id = orders.id
    LEFT JOIN delivery_orders ON delivery_orders.order_id = orders.id
    LEFT JOIN order_items ON order_items.order_id = orders.id
    GROUP BY orders.id
    ORDER BY orders.id DESC
    LIMIT ?
  `).all(limit).map((order) => ({
    ...order,
    orderNumber: order.id,
    subtotal: order.subtotalCents / 100,
    discount: order.discountCents / 100,
    tax: order.taxCents / 100,
    total: order.totalCents / 100,
    amountPaid: order.amountPaidCents === null ? null : order.amountPaidCents / 100,
    items: db.prepare(`
      SELECT
        order_items.id,
        order_items.product_id AS productId,
        order_items.product_name AS name,
        order_items.image_url AS image,
        order_items.quantity,
        order_items.size_name AS size,
        order_items.base_price_cents / 100.0 AS basePrice,
        order_items.size_adjustment_cents / 100.0 AS sizeAdjustment,
        order_items.unit_price_cents / 100.0 AS unitPrice,
        order_items.line_total_cents / 100.0 AS lineTotal,
        order_items.notes,
        COALESCE(json_group_array(
          CASE WHEN order_item_add_ons.id IS NULL THEN NULL
          ELSE json_object(
            'id', order_item_add_ons.add_on_id,
            'name', order_item_add_ons.add_on_name,
            'price', order_item_add_ons.price_cents / 100.0
          ) END
        ) FILTER (WHERE order_item_add_ons.id IS NOT NULL), '[]') AS addOnsJson
      FROM order_items
      LEFT JOIN order_item_add_ons ON order_item_add_ons.order_item_id = order_items.id
      WHERE order_items.order_id = ?
      GROUP BY order_items.id
      ORDER BY order_items.id
    `).all(order.id).map((item) => ({
      ...item,
      addOns: JSON.parse(item.addOnsJson),
      addOnsJson: undefined,
    })),
  }));
}
