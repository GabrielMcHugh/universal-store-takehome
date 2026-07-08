import { InStockProduct } from '../types/catalogItem';

type Props = {
  product: InStockProduct;
};

export function ProductCard({ product }: Props) {
  return (
    <article className="product-card">
      <img src={product.image} alt={product.title} />
      <h2>{product.title}</h2>
      <p>SKU: {product.sku}</p>
      <p>{product.quantity} in stock</p>
      <p>${product.price.toFixed(2)}</p>
    </article>
  );
}