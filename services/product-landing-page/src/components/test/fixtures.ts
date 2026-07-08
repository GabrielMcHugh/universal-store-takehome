import { CatalogItem, InventoryItem, InStockProduct } from "../../types/catalogItem";

export const shirtProduct: InStockProduct = {
  sku: '111111',
  title: 'Shirt',
  price: 49.99,
  image: 'https://example.com/shirt.jpg',
  quantity: 3,
};

export const hatProduct: InStockProduct = {
  sku: '222222',
  title: 'Hat',
  price: 29.99,
  image: 'https://example.com/hat.jpg',
  quantity: 7,
};

export const catalogItems: CatalogItem[] = [
  { sku: '111111', title: 'Shirt', price: 49.99, image: 'https://example.com/shirt.jpg' },
  { sku: '222222', title: 'Hat', price: 29.99, image: 'https://example.com/hat.jpg' },
];

export const inventoryItems: InventoryItem[] = [
  { sku: '111111', quantity: 3 },
  { sku: '222222', quantity: 0 }, // out of stock — useful for ProductCatalog test
];