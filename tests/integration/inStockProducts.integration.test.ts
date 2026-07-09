const BFF_URL = process.env.BFF_URL ?? 'http://localhost:5000';

type InStockProduct = {
  sku: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${url}`);
  }
  return response.json() as Promise<T>;
}

describe('cross-service: BFF', () => {
  test('GET /products/in-stock returns merged in-stock products', async () => {
    const inStock = await fetchJson<InStockProduct[]>(`${BFF_URL}/products/in-stock`);

    expect(inStock.length).toBe(3);
    const skus = inStock.map((p) => p.sku);
    expect(skus).toEqual(expect.arrayContaining(['111111', '222222', '333333']));
    expect(skus).not.toContain('444444');

    const pen = inStock.find((p) => p.sku === '111111');
    expect(pen).toMatchObject({
      title: 'Pen',
      quantity: 3,
      price: 3,
    });
  });
});
