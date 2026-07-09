import { InStockProduct } from '../../types/product';

export const shirtProduct: InStockProduct = {
  sku: '111111',
  title: 'Shirt',
  price: 49.99,
  image: 'https://example.com/shirt.jpg',
  quantity: 3,
};

export const hatProduct: InStockProduct = {
  sku: '222222',
  title: 'Hat',
  price: 29.99,
  image: 'https://example.com/hat.jpg',
  quantity: 7,
};

export const inStockProducts: InStockProduct[] = [shirtProduct];
