# Catalog Service

REST API for product catalog data. Runs on port **3000**.

## API Endpoints

### `GET /catalog`

Returns all catalog items.

**Response:** `200` — `CatalogItem[]`

| Field | Type   | Description       |
|-------|--------|-------------------|
| sku   | string | Unique product ID |
| title | string | Product name      |
| price | number | Price             |
| image | string | Image URL         |

### `GET /catalog/:sku`

Returns a single catalog item by SKU.

**Response:** `200` — `CatalogItem`  
**Errors:** `400` invalid SKU, `404` not found

## Docs

Interactive API docs: [http://localhost:3000/docs](http://localhost:3000/docs)
