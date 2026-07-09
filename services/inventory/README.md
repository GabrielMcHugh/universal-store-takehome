# Inventory Service

REST API for product stock quantities. Runs on port **4000**.

## API Endpoints

### `GET /inventory`

Returns all inventory items.

**Response:** `200` — `InventoryItem[]`

| Field    | Type   | Description              |
|----------|--------|--------------------------|
| sku      | string | Unique product ID        |
| quantity | number | Available stock quantity |

### `GET /inventory/:sku`

Returns stock quantity for a single product by SKU.

**Response:** `200` — `InventoryItem`  
**Errors:** `400` invalid SKU, `404` not found

## Docs

Interactive API docs: [http://localhost:4000/docs](http://localhost:4000/docs)
