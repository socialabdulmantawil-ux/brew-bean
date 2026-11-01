import { createServer } from 'node:http';
import { db, getBootstrap, getOrders, getProducts } from './db.mjs';

const port = Number(process.env.API_PORT || 3001);
const jsonHeaders = { 'content-type': 'application/json; charset=utf-8' };

function respond(response, status, body) {
  response.writeHead(status, jsonHeaders);
  response.end(JSON.stringify(body));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(Object.assign(new Error('Request body is too large.'), { status: 413 }));
        request.destroy();
      }
    });
    request.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(Object.assign(new Error('Request body must be valid JSON.'), { status: 400 }));
      }
    });
    request.on('error', reject);
  });
}

function amountToCents(value, fieldName) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0 || amount > 1_000_000) {
    throw Object.assign(new Error(`${fieldName} must be a non-negative amount.`), { status: 400 });
  }
  return Math.round(amount * 100);
}

function adjustmentToCents(value) {
  const adjustment = Number(value);
  if (!Number.isFinite(adjustment) || Math.abs(adjustment) > 10_000) {
    throw Object.assign(new Error('Size adjustment must be a valid amount.'), { status: 400 });
  }
  return Math.round(adjustment * 100);
}

function requireText(value, fieldName, maxLength = 200) {
  if (typeof value !== 'string' || value.trim().length === 0 || value.length > maxLength) {
    throw Object.assign(new Error(`${fieldName} is required.`), { status: 400 });
  }
  return value.trim();
}

function createOrder(payload) {
  if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
    throw Object.assign(new Error('An order must contain at least one item.'), { status: 400 });
  }

  const orderType = requireText(payload.orderType, 'Order type');
  if (!['Dine-in', 'Takeout', 'Delivery'].includes(orderType)) {
    throw Object.assign(new Error('Order type is not supported.'), { status: 400 });
  }
  const customerType = requireText(payload.customerType, 'Customer type');
  const isDelivery = orderType === 'Delivery';
  const payment = payload.payment;
  if (!isDelivery && (!payment || !['Card', 'Cash', 'Wallet'].includes(payment.method))) {
    throw Object.assign(new Error('A valid payment method is required.'), { status: 400 });
  }
  if (isDelivery && !payload.delivery) {
    throw Object.assign(new Error('Delivery details are required.'), { status: 400 });
  }

  const productsById = new Map(getProducts().map((product) => [product.id, product]));
  const sizeByName = new Map(
    db.prepare('SELECT name, adjustment_cents FROM size_options').all()
      .map((size) => [size.name, size.adjustment_cents]),
  );
  const addOnsById = new Map(
    db.prepare(`
      SELECT add_ons.id, add_ons.name, add_ons.price_cents, categories.name AS category
      FROM add_ons
      JOIN category_add_ons ON category_add_ons.add_on_id = add_ons.id
      JOIN categories ON categories.id = category_add_ons.category_id
      WHERE add_ons.is_active = 1
    `).all()
      .map((addOn) => [addOn.id, addOn]),
  );

  const items = payload.items.map((item) => {
    const product = productsById.get(item?.productId);
    if (!product) {
      throw Object.assign(new Error('An order contains an unknown product.'), { status: 400 });
    }
    const quantity = Number(item.quantity);
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 999) {
      throw Object.assign(new Error(`Invalid quantity for ${product.name}.`), { status: 400 });
    }
    const size = requireText(item.size, 'Item size', 100);
    const sizeAdjustmentCents = adjustmentToCents(item.sizeAdjustment);
    const expectedSizeAdjustment = sizeByName.get(size);
    if (
      (expectedSizeAdjustment !== undefined && sizeAdjustmentCents !== expectedSizeAdjustment) ||
      (expectedSizeAdjustment === undefined && sizeAdjustmentCents !== 0)
    ) {
      throw Object.assign(new Error(`Invalid size price for ${product.name}.`), { status: 400 });
    }

    const basePriceCents = amountToCents(item.basePrice, 'Base price');
    const addOnIds = item.selectedAddOns;
    if (!Array.isArray(addOnIds)) {
      throw Object.assign(new Error(`Add-ons for ${product.name} are invalid.`), { status: 400 });
    }
    const addOns = addOnIds.map((addOnId) => {
      const addOn = addOnsById.get(addOnId);
      if (!addOn) {
        throw Object.assign(new Error(`An add-on for ${product.name} is unavailable.`), { status: 400 });
      }
      if (addOn.category !== product.category) {
        throw Object.assign(new Error(`${addOn.name} is not available for ${product.category}.`), { status: 400 });
      }
      return addOn;
    });
    const unitPriceCents = basePriceCents + sizeAdjustmentCents
      + addOns.reduce((total, addOn) => total + addOn.price_cents, 0);
    if (unitPriceCents < 0) {
      throw Object.assign(new Error(`Price for ${product.name} cannot be negative.`), { status: 400 });
    }

    return {
      product,
      quantity,
      size,
      sizeAdjustmentCents,
      basePriceCents,
      unitPriceCents,
      lineTotalCents: unitPriceCents * quantity,
      notes: typeof item.notes === 'string' ? item.notes.slice(0, 1000) : '',
      addOns,
    };
  });

  const subtotalCents = items.reduce((total, item) => total + item.lineTotalCents, 0);
  const settings = Object.fromEntries(
    db.prepare('SELECT key, value FROM settings').all().map(({ key, value }) => [key, value]),
  );
  const promoApplied = !isDelivery && payload.promoApplied === true;
  const discountCents = promoApplied
    ? Math.round(subtotalCents * Number(settings.promo_discount_percent) / 100)
    : 0;
  const taxableCents = subtotalCents - discountCents;
  const taxCents = Math.round(taxableCents * Number(settings.tax_rate_percent) / 100);
  const totalCents = taxableCents + taxCents;

  let paymentValues;
  if (isDelivery) {
    paymentValues = { method: null, status: 'pending', receivedCents: null, changeCents: null, cardLastFour: null, walletReference: null };
  } else if (payment.method === 'Cash') {
    const receivedCents = amountToCents(payment.cashReceived, 'Cash received');
    if (receivedCents < totalCents) {
      throw Object.assign(new Error('Cash received is less than the order total.'), { status: 400 });
    }
    paymentValues = { method: 'Cash', status: 'paid', receivedCents, changeCents: receivedCents - totalCents, cardLastFour: null, walletReference: null };
  } else if (payment.method === 'Card') {
    const cardLastFour = requireText(payment.cardLastFour, 'Card transaction last four digits', 4);
    if (!/^\d{4}$/.test(cardLastFour)) {
      throw Object.assign(new Error('Card transaction details must contain four digits.'), { status: 400 });
    }
    paymentValues = { method: 'Card', status: 'paid', receivedCents: null, changeCents: null, cardLastFour, walletReference: null };
  } else {
    paymentValues = {
      method: 'Wallet',
      status: 'paid',
      receivedCents: null,
      changeCents: null,
      cardLastFour: null,
      walletReference: requireText(payment.walletReference, 'Wallet reference', 200),
    };
  }

  let deliveryValues = null;
  if (isDelivery) {
    deliveryValues = {
      appName: requireText(payload.delivery.appName, 'Delivery app', 100),
      orderNumber: requireText(payload.delivery.orderNumber, 'Delivery order number', 20),
    };
  }

  db.exec('BEGIN IMMEDIATE');
  try {
    for (const item of items) {
      const stock = db.prepare('SELECT stock FROM products WHERE id = ?').get(item.product.id).stock;
      if (stock < item.quantity) {
        throw Object.assign(new Error(`Not enough stock for ${item.product.name}.`), { status: 409 });
      }
    }

    const orderNumber = db.prepare(
      'SELECT next_number FROM order_number_sequence WHERE id = 1',
    ).get().next_number;
    db.prepare('UPDATE order_number_sequence SET next_number = next_number + 1 WHERE id = 1').run();
    db.prepare(`
      INSERT INTO orders
        (id, order_type, customer_type, status, payment_status, promo_code,
         subtotal_cents, discount_cents, tax_cents, total_cents, currency)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderNumber,
      orderType,
      customerType,
      isDelivery ? 'confirmed' : 'completed',
      paymentValues.status,
      promoApplied ? String(payload.promoCode || '').slice(0, 100) : null,
      subtotalCents,
      discountCents,
      taxCents,
      totalCents,
      settings.currency,
    );

    const insertItem = db.prepare(`
      INSERT INTO order_items
        (order_id, product_id, product_name, image_url, quantity, size_name,
         base_price_cents, size_adjustment_cents, unit_price_cents, line_total_cents, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertItemAddOn = db.prepare(`
      INSERT INTO order_item_add_ons (order_item_id, add_on_id, add_on_name, price_cents)
      VALUES (?, ?, ?, ?)
    `);
    const decrementStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
    for (const item of items) {
      const result = insertItem.run(
        orderNumber,
        item.product.id,
        item.product.name,
        item.product.image,
        item.quantity,
        item.size,
        item.basePriceCents,
        item.sizeAdjustmentCents,
        item.unitPriceCents,
        item.lineTotalCents,
        item.notes,
      );
      for (const addOn of item.addOns) {
        insertItemAddOn.run(result.lastInsertRowid, addOn.id, addOn.name, addOn.price_cents);
      }
      decrementStock.run(item.quantity, item.product.id);
    }

    db.prepare(`
      INSERT INTO payments
        (order_id, method, status, amount_cents, cash_received_cents, change_cents, card_last_four, wallet_reference)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderNumber,
      paymentValues.method,
      paymentValues.status,
      totalCents,
      paymentValues.receivedCents,
      paymentValues.changeCents,
      paymentValues.cardLastFour,
      paymentValues.walletReference,
    );
    if (deliveryValues) {
      db.prepare(`
        INSERT INTO delivery_orders (order_id, app_name, external_order_number)
        VALUES (?, ?, ?)
      `).run(orderNumber, deliveryValues.appName, deliveryValues.orderNumber);
    }

    db.exec('COMMIT');
    return { orderNumber, products: getProducts() };
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host || 'localhost'}`).pathname;
  try {
    if (request.method === 'GET' && pathname === '/api/health') {
      respond(response, 200, { status: 'ok' });
      return;
    }
    if (request.method === 'GET' && pathname === '/api/bootstrap') {
      respond(response, 200, getBootstrap());
      return;
    }
    if (request.method === 'GET' && pathname === '/api/orders') {
      const requestedLimit = Number(new URL(request.url, 'http://localhost').searchParams.get('limit') || 50);
      const limit = Number.isSafeInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 200) : 50;
      respond(response, 200, { orders: getOrders(limit) });
      return;
    }
    if (request.method === 'POST' && pathname === '/api/orders') {
      const result = createOrder(await readJson(request));
      respond(response, 201, result);
      return;
    }
    respond(response, 404, { error: 'API route not found.' });
  } catch (error) {
    if (error instanceof SyntaxError) {
      respond(response, 400, { error: 'Request body must be valid JSON.' });
      return;
    }
    console.error('SQLite API request failed:', error);
    respond(response, error.status || 500, {
      error: error.status ? error.message : 'The database request failed.',
    });
  }
});

server.listen(port, () => {
  console.log(`SQLite API listening on http://localhost:${port}`);
});

server.on('error', (error) => {
  console.error(`SQLite API could not listen on port ${port}:`, error);
  db.close();
  process.exitCode = 1;
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => {
      db.close();
      process.exit(0);
    });
  });
}
