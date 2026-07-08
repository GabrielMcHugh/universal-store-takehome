import { INVENTORY_URL } from "../config/api";
import { InventoryItem } from "../types/catalogItem";


export async function fetchInventory(): Promise<InventoryItem[]> {
    const response = await fetch(`${INVENTORY_URL}/inventory`);

    if (!response.ok) {
        throw new Error(`Inventory request failed: ${response.status}`);
    }

    return response.json();
}