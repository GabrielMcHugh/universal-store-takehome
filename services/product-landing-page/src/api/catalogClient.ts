import { CATALOG_URL } from "../config/api";
import { CatalogItem } from "../types/catalogItem";

export async function fetchCatalog(): Promise<CatalogItem[]> {
    const response = await fetch (`${CATALOG_URL}/catalog`);

    if (!response.ok) {
        throw new Error(`Catalog request failed: ${response.status}`);
    }

    return response.json();
}