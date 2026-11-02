PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id),
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  stock INTEGER NOT NULL CHECK (stock >= 0),
  tag TEXT,
  tag_color TEXT,
  image_url TEXT NOT NULL,
  default_size TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1))
);

CREATE TABLE IF NOT EXISTS size_options (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  adjustment_cents INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS add_ons (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1))
);

CREATE TABLE IF NOT EXISTS category_add_ons (
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  add_on_id TEXT NOT NULL REFERENCES add_ons(id) ON DELETE CASCADE,
  PRIMARY KEY (category_id, add_on_id)
);

CREATE TABLE IF NOT EXISTS product_default_add_ons (
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  add_on_id TEXT NOT NULL REFERENCES add_ons(id),
  PRIMARY KEY (product_id, add_on_id)
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS order_number_sequence (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  next_number INTEGER NOT NULL CHECK (next_number > 0)
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY,
  order_type TEXT NOT NULL CHECK (order_type IN ('Dine-in', 'Takeout', 'Delivery')),
  customer_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'confirmed')),
  payment_status TEXT NOT NULL CHECK (payment_status IN ('paid', 'pending')),
  promo_code TEXT,
  subtotal_cents INTEGER NOT NULL CHECK (subtotal_cents >= 0),
  discount_cents INTEGER NOT NULL CHECK (discount_cents >= 0),
  tax_cents INTEGER NOT NULL CHECK (tax_cents >= 0),
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  currency TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  size_name TEXT NOT NULL,
  base_price_cents INTEGER NOT NULL CHECK (base_price_cents >= 0),
  size_adjustment_cents INTEGER NOT NULL,
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
  line_total_cents INTEGER NOT NULL CHECK (line_total_cents >= 0),
  notes TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS order_item_add_ons (
  id INTEGER PRIMARY KEY,
  order_item_id INTEGER NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  add_on_id TEXT REFERENCES add_ons(id),
  add_on_name TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0)
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  method TEXT CHECK (method IN ('Card', 'Cash', 'Wallet')),
  status TEXT NOT NULL CHECK (status IN ('paid', 'pending')),
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
  cash_received_cents INTEGER CHECK (cash_received_cents >= 0),
  change_cents INTEGER CHECK (change_cents >= 0),
  card_last_four TEXT CHECK (card_last_four IS NULL OR length(card_last_four) = 4),
  wallet_reference TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS delivery_orders (
  order_id INTEGER PRIMARY KEY REFERENCES orders(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL,
  external_order_number TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
