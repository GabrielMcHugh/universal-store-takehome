import { atom } from 'jotai';
import { fetchProducts } from '../api/productsClient';
import { InStockProduct } from '../types/product';

export const productsAtom = atom<InStockProduct[]>([]);
export const loadingAtom = atom(true);
export const errorAtom = atom<string | null>(null);

export const loadProductsAtom = atom(null, async (_get, set, signal?: AbortSignal) => {
  set(loadingAtom, true);
  set(errorAtom, null);

  try {
    const products = await fetchProducts(signal);

    if (signal?.aborted) return;

    set(productsAtom, products);
  } catch (err) {
    set(errorAtom, err instanceof Error ? err.message : 'Failed to load products');
  } finally {
    set(loadingAtom, false);
  }
});
