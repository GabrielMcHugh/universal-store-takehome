import { InStockProduct } from '../types/catalogItem';
import { ProductCard } from './ProductCard';
type Props = {
  products: InStockProduct[];
};
export function ProductList({ products }: Props) {
  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard key={product.sku} product={product} />
      ))}
    </div>
  );
}