import request from 'supertest';
import { createApp } from './app';

const catalogItems = [
  { sku: '111111', title: 'Shirt', price: 49.99, image: 'https://example.com/shirt.jpg' },
  { sku: '222222', title: 'Hat', price: 29.99, image: 'https://example.com/hat.jpg' },
];

const inventoryItems = [
  { sku: '111111', quantity: 3 },
  { sku: '222222', quantity: 0 },
];

function mockFetchResponse(status: number, body?: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

describe('PLP BFF', () => {
  const app = createApp({
    clientUrl: 'http://localhost:8080',
    catalogUrl: 'http://catalog.test',
    inventoryUrl: 'http://inventory.test',
  });

  beforeEach(() => {
    jest.spyOn(globalThis, 'fetch').mockImplementation((input) => {
      const href = input.toString();
      if (href.endsWith('/catalog')) {
        return Promise.resolve(mockFetchResponse(200, catalogItems) as Response);
      }
      if (href.endsWith('/inventory')) {
        return Promise.resolve(mockFetchResponse(200, inventoryItems) as Response);
      }
      return Promise.resolve(mockFetchResponse(404) as Response);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('GET /products/in-stock returns merged in-stock products', async () => {
    const response = await request(app).get('/products/in-stock');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { sku: '111111', title: 'Shirt', price: 49.99, image: 'https://example.com/shirt.jpg', quantity: 3 },
    ]);
  });

  test('GET /products/in-stock returns 502 when upstream fails', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(mockFetchResponse(500) as Response);

    const response = await request(app).get('/products/in-stock');

    expect(response.status).toBe(502);
    expect(response.body).toEqual({ error: 'Failed to load products' });
  });

  test('unknown routes return 404', async () => {
    const response = await request(app).get('/unknown');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Not found' });
  });

  test('GET /docs returns Swagger UI', async () => {
    const response = await request(app).get('/docs');

    expect(response.status).toBe(200);
  });
});
