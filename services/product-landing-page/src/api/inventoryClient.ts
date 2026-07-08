import { INVENTORY_URL } from "../config/api";
import { inventoryResponseSchema } from "../schemas/inventoryItemSchema";
import { InventoryItem } from "../types/catalogItem";

export async function fetchInventory(signal?: AbortSignal): Promise<InventoryItem[]> {
    const response = await fetch(`${INVENTORY_URL}/inventory`, { signal });

    if (!response.ok) {
        throw new Error(`Inventory request failed: ${response.status}`);
    }

    const data: unknown = await response.json();

    // inventoryResponseSchema expects an array, but you were validating single object
    const result = inventoryResponseSchema.safeParse(data);

    if (!result.success) {
        throw new Error(`Invalid inventory response: ${result.error.message}`);
    }

    return result.data;
}