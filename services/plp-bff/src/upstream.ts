import { AppConfig, CatalogItem, InventoryItem } from './types';

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${url}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchProductSources(
  config: Pick<AppConfig, 'catalogUrl' | 'inventoryUrl'>
): Promise<{ catalog: CatalogItem[]; inventory: InventoryItem[] }> {
  const [catalog, inventory] = await Promise.all([
    fetchJson<CatalogItem[]>(`${config.catalogUrl}/catalog`),
    fetchJson<InventoryItem[]>(`${config.inventoryUrl}/inventory`),
  ]);

  return { catalog, inventory };
}
