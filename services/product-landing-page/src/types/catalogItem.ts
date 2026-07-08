// PLP knows what the API returns — not how catalog defines its Mongoose model
interface CatalogItem {
  sku: string;
  title: string;
  price: number;
  image: string;
}

export interface InventoryItem {
    sku: string;
    quantity: number;
}
