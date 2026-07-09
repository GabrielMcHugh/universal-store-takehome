import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from './app';
import { Catalog } from './model/catalog';
import { CatalogItem } from './types/catalogItem';

//Backend Integration test on Mongo + express

//Data factory
export const catalogItemFixture = (
    overrides: Partial<CatalogItem> = {}
): CatalogItem => ({
    sku: "SKU-001",
    title: "Test Product",
    price: 29.99,
    image: "https://example.com/image.jpg",
    ...overrides,
})

const singleItemTest: CatalogItem = catalogItemFixture()

const multiItemTest: CatalogItem[] = [
    catalogItemFixture({ sku: "SKU-001", title: "Product 1" }),
    catalogItemFixture({ sku: "SKU-002", title: "Product 2" }),
    catalogItemFixture({ sku: "SKU-003", title: "Product 3" })
];


describe("Catalog API", () => {
    let mongo: MongoMemoryServer;
    const app = createApp({ rateLimit: { enabled: false } });

    beforeAll(async () => {
        mongo = await MongoMemoryServer.create();
        await mongoose.connect(mongo.getUri())
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongo.stop();
    });

    beforeEach(async () => {
        await Catalog.deleteMany({})
    })

    describe("GET /catalog", () => {
        it("returns catalog items", async () => {
            await Catalog.create(singleItemTest);

            const res = await request(app).get("/catalog");

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0]).toMatchObject(singleItemTest);
        });

        it("returns multiple catalog items", async () => {
            await Catalog.create(multiItemTest);

            const res = await request(app).get("/catalog");

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(multiItemTest.length);
            expect(res.body).toEqual(
                expect.arrayContaining(
                    multiItemTest.map(item => expect.objectContaining(item))
                )
            );
        });

        it("returns 200 with an empty array when no items exist", async () => {
            const res = await request(app).get('/catalog');
            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });

        it("returns 429 when rate limit is exceeded", async () => {
            const app = createApp({ rateLimit: { max: 2, windowMs: 60_000 } });
            await request(app).get("/catalog");
            await request(app).get("/catalog");
            const res = await request(app).get("/catalog");
            expect(res.status).toBe(429);
            expect(res.body).toEqual({ error: "Too many requests, please try again later" });
        });
    });

    describe("GET /catalog/:sku", () => {

        it("returns the catalog item for a specific sku", async () => {
            await Catalog.create(multiItemTest);
            const expectedItem = multiItemTest[1];

            const res = await request(app).get(`/catalog/${expectedItem.sku}`);

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject(expectedItem);
        });

        it("returns 404 if the sku does not exist", async () => {
            await Catalog.create(singleItemTest);
            const res = await request(app).get("/catalog/nonexistentsku");
            expect(res.status).toBe(404);
        });

        it("returns 404 when the catalog is empty", async () => {
            const res = await request(app).get("/catalog/SKU-001");
            expect(res.status).toBe(404);
        });

        it("returns 400 for invalid sku format", async () => {
            const res = await request(app).get("/catalog/not%20valid");
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "Invalid SKU format" });
        });
        it("returns 400 for sku with injection-like characters", async () => {
            const res = await request(app).get('/catalog/{"$gt":""}');
            expect(res.status).toBe(400);
        });
    });
});
