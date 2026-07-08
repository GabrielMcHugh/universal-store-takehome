import { CatalogItem, InStockProduct, InventoryItem } from "../types/catalogItem";
 
export function getInStockProducts(
    catalog: CatalogItem[],
    inventory: InventoryItem[]
): InStockProduct[] {
    //Build map from inventory O(n)
    const quantityBySku = new Map(
        inventory.map((item) => [item.sku, item.quantity])
    );

    //Loop over catalog and get quanity from inventory map
    return catalog.flatMap((item) => {
        const quantity = quantityBySku.get(item.sku);
        if (quantity === undefined || quantity <= 0) return [];
        return [{ ...item, quantity }];
    });
}
