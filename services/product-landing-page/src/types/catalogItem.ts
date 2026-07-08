import z from 'zod';
import { catalogItemSchema } from '../schemas/catalogItemSchema';
import { inventoryItemSchema } from '../schemas/inventoryItemSchema';

export type CatalogItem = z.infer<typeof catalogItemSchema>;
export type InventoryItem = z.infer<typeof inventoryItemSchema>;
export type InStockProduct = CatalogItem & Pick<InventoryItem, 'quantity'>;