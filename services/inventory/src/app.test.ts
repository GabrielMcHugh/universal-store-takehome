import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from './app';
import { Inventory } from './model/inventory';
import { InventoryItem } from './types/inventoryItem';

const inventoryItemFixture = (
  overrides: Partial<InventoryItem> = {}
): InventoryItem => ({
  sku: '111111',
  quantity: 3,
  ...overrides,
});

const singleItemTest = inventoryItemFixture();

const multiItemTest: InventoryItem[] = [
  inventoryItemFixture({ sku: '111111', quantity: 3 }),
  inventoryItemFixture({ sku: '222222', quantity: 7 }),
  inventoryItemFixture({ sku: '333333', quantity: 1 }),
];

const testClientUrl = 'http://localhost:8080';

describe('Inventory API', () => {
  let mongo: MongoMemoryServer;
  const app = createApp({ clientUrl: testClientUrl, rateLimit: { enabled: false } });

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  beforeEach(async () => {
    await Inventory.deleteMany({});
  });

  describe('GET /inventory', () => {
    it('sets CORS origin to configured client URL', async () => {
      const res = await request(app).get('/inventory');

      expect(res.headers['access-control-allow-origin']).toBe(testClientUrl);
      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('returns inventory items', async () => {
      await Inventory.create(singleItemTest);

      const res = await request(app).get('/inventory');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toMatchObject(singleItemTest);
    });

    it('returns multiple inventory items', async () => {
      await Inventory.create(multiItemTest);

      const res = await request(app).get('/inventory');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(multiItemTest.length);
      expect(res.body).toEqual(
        expect.arrayContaining(
          multiItemTest.map((item) => expect.objectContaining(item))
        )
      );
    });

    it('returns 200 with an empty array when no items exist', async () => {
      const res = await request(app).get('/inventory');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns 429 when rate limit is exceeded', async () => {
      const app = createApp({ clientUrl: testClientUrl, rateLimit: { max: 2, windowMs: 60_000 } });
      await request(app).get('/inventory');
      await request(app).get('/inventory');
      const res = await request(app).get('/inventory');
      expect(res.status).toBe(429);
      expect(res.body).toEqual({ error: 'Too many requests, please try again later' });
    });
  });

  describe('GET /inventory/:sku', () => {
    it('returns the inventory item for a specific sku', async () => {
      await Inventory.create(multiItemTest);
      const expectedItem = multiItemTest[1];

      const res = await request(app).get(`/inventory/${expectedItem.sku}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(expectedItem);
    });

    it('returns 404 if the sku does not exist', async () => {
      await Inventory.create(singleItemTest);

      const res = await request(app).get('/inventory/nonexistentsku');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Inventory item not found' });
    });

    it('returns 404 when the inventory is empty', async () => {
      const res = await request(app).get('/inventory/111111');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Inventory item not found' });
    });

    it('returns 400 for invalid sku format', async () => {
      const res = await request(app).get('/inventory/not%20valid');

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid SKU format' });
    });

    it('returns 400 for sku with injection-like characters', async () => {
      const res = await request(app).get('/inventory/{"$gt":""}');

      expect(res.status).toBe(400);
    });
  });
});
