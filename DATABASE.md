# SQLite database

The POS uses a local SQLite database at `data/brew-bean.sqlite`. The file is created and seeded automatically the first time the API starts. The SQLite file is intentionally ignored by Git so sales data stays local to the installation.

Run `npm run dev` to start the POS and its SQLite API together. To run the API separately, use `npm run server`. Node.js 22.5 or newer is required for the built-in SQLite driver. Set `SQLITE_DB_PATH` to use a different database file.

## Tables

| Table | Contents |
|---|---|
| `categories` | Catalog category names and IDs. |
| `products` | Product names, categories, cent-denominated prices, stock, tags, images, and default sizes. |
| `size_options` | Available sizes and their cent-denominated price adjustments. |
| `add_ons` | Available modifiers and their cent-denominated prices. |
| `product_default_add_ons` | Default product-to-modifier relationships. |
| `settings` | Tax rate, promotional discount rate, and currency. |
| `order_number_sequence` | The next receipt/order number. |
| `orders` | Completed/confirmed order details and monetary totals. |
| `order_items` | Product, quantity, size, price snapshots, and preparation notes for each order line. |
| `order_item_add_ons` | Modifier snapshots for each order line. |
| `payments` | Payment method, status, amount, cash/change, card last four digits, or wallet reference. |
| `delivery_orders` | Delivery provider and external order number. |

Prices and totals are stored as integer cents. Order creation, payment/delivery records, stock decrements, and order numbering are written in one transaction. Delivery orders are recorded as pending payment; other checkout methods are recorded as paid.

## API

- `GET /api/health` checks that the database service is running.
- `GET /api/bootstrap` returns the catalog, options, settings, and next order number for the POS.
- `POST /api/orders` records a checkout and decrements product stock.
- `GET /api/orders?limit=50` returns recent orders with item, payment, and delivery details (maximum 200).
