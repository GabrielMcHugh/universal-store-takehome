# PLP BFF

Backend-for-frontend that merges catalog and inventory data for the product landing page. Runs on port **5000**.

## API Endpoints

### `GET /products/in-stock`

Fetches catalog and inventory from upstream services and returns products with quantity greater than zero.

**Response:** `200` — `InStockProduct[]`

| Field    | Type   | Description       |
|----------|--------|-------------------|
| sku      | string | Unique product ID |
| title    | string | Product name      |
| price    | number | Price             |
| image    | string | Image URL         |
| quantity | number | Stock quantity    |

**Errors:** `502` when catalog or inventory is unavailable

## Docs

Interactive API docs: [http://localhost:5000/docs](http://localhost:5000/docs)
