export type AppConfig = {
  clientUrl: string;
  catalogUrl: string;
  inventoryUrl: string;
};

export type CatalogItem = {
  sku: string;
  title: string;
  price: number;
  image: string;
};

export type InventoryItem = {
  sku: string;
  quantity: number;
};

export type InStockProduct = CatalogItem & Pick<InventoryItem, 'quantity'>;
