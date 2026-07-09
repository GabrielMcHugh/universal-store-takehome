import { CatalogItem, InStockProduct, InventoryItem } from './types';

export function getInStockProducts(
  catalog: CatalogItem[],
  inventory: InventoryItem[]
): InStockProduct[] {
  const quantityBySku = new Map(
    inventory.map((item) => [item.sku, item.quantity])
  );

  return catalog.flatMap((item) => {
    const quantity = quantityBySku.get(item.sku);
    if (quantity === undefined || quantity <= 0) return [];
    return [{ ...item, quantity }];
  });
}
