import { atom } from 'jotai';
import { fetchCatalog } from '../api/catalogClient';
import { fetchInventory } from '../api/inventoryClient';
import { getInStockProducts } from '../services/getInStockProducts';
import { InStockProduct } from '../types/catalogItem';

export const productsAtom = atom<InStockProduct[]>([]);
export const loadingAtom = atom(true);
export const errorAtom = atom<string | null>(null);

export const loadProductsAtom = atom(null, async (_get, set) => {
  set(loadingAtom, true);
  set(errorAtom, null);

  try {
    const [catalog, inventory] = await Promise.all([
      fetchCatalog(),
      fetchInventory(),
    ]);
    set(productsAtom, getInStockProducts(catalog, inventory));
  } catch (err) {
    set(errorAtom, err instanceof Error ? err.message : 'Failed to load products');
  } finally {
    set(loadingAtom, false);
  }
});