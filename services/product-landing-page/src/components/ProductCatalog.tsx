import { useProducts } from '../hooks/useProduct';
import { ProductList } from './ProductList';

export function ProductCatalog() {
  const { products, loading, error } = useProducts();

  if (loading) return <p>Loading products...</p>;
  if (error) return <p role="alert">Error: {error}</p>;
  if (products.length === 0) return <p>No products in stock</p>;

  return <ProductList products={products} />;
}