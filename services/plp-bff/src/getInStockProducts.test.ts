import { getInStockProducts } from './getInStockProducts';

describe('getInStockProducts', () => {
  test('merges catalog and inventory by sku', () => {
    const catalog = [
      { sku: '111111', title: 'Shirt', price: 49.99, image: 'https://example.com/shirt.jpg' },
    ];
    const inventory = [{ sku: '111111', quantity: 3 }];
    expect(getInStockProducts(catalog, inventory)).toEqual([
      { sku: '111111', title: 'Shirt', price: 49.99, image: 'https://example.com/shirt.jpg', quantity: 3 },
    ]);
  });

  test('excludes items with zero quantity', () => {
    const catalog = [
      { sku: '111111', title: 'Shirt', price: 49.99, image: 'https://example.com/a.jpg' },
    ];
    const inventory = [{ sku: '111111', quantity: 0 }];
    expect(getInStockProducts(catalog, inventory)).toEqual([]);
  });

  test('excludes catalog items missing from inventory', () => {
    const catalog = [
      { sku: '999999', title: 'Hat', price: 29.99, image: 'https://example.com/hat.jpg' },
    ];
    const inventory = [{ sku: '111111', quantity: 5 }];
    expect(getInStockProducts(catalog, inventory)).toEqual([]);
  });
});
