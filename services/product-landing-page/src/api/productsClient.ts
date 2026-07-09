import { BFF_URL } from '../config/api';
import { productsResponseSchema } from '../schemas/productSchema';
import { InStockProduct } from '../types/product';

export async function fetchProducts(signal?: AbortSignal): Promise<InStockProduct[]> {
  const response = await fetch(`${BFF_URL}/products/in-stock`, { signal });

  if (!response.ok) {
    throw new Error(`Products request failed: ${response.status}`);
  }

  const data: unknown = await response.json();
  const result = productsResponseSchema.safeParse(data);

  if (!result.success) {
    throw new Error(`Invalid products response: ${result.error.message}`);
  }

  return result.data;
}
