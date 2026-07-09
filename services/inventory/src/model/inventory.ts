import mongoose, { InferSchemaType } from "mongoose";
import { InventoryItem } from "../types/inventoryItem";

const inventorySchema = new mongoose.Schema<InventoryItem>({
    sku: String,
    quantity: Number,
});

export type InventoryDocument = InferSchemaType<typeof inventorySchema>
export const Inventory = mongoose.model<InventoryDocument>('Inventory', inventorySchema);
