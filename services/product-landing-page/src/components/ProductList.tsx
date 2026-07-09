import { InStockProduct } from '../types/product';
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