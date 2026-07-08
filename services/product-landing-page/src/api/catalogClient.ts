import { CATALOG_URL } from "../config/api";
import { catalogResponseSchema } from "../schemas/catalogItemSchema";
import { CatalogItem } from "../types/catalogItem";

export async function fetchCatalog(): Promise<CatalogItem[]> {
    const response = await fetch(`${CATALOG_URL}/catalog`);

    if (!response.ok) {
        throw new Error(`Catalog request failed: ${response.status}`);
    }

    const data: unknown = await response.json();

    //Validating schema
    const result = catalogResponseSchema.safeParse(data);

    if (!result.success) {
        throw new Error(`Invalid catalog response: ${result.error.message}`);
    }

    return result.data;
}