import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from './app';
import { Catalog } from './model/catalog';
import { CatalogItem } from './types/catalogItem';

//Data factory
export const catalogItemFixture = (
    overrides: Partial<CatalogItem> = {}
): CatalogItem => ({
    sku: "SKU-001",
    title: "Test Product",
    price: 29.99,
    image: "https://example.com/image.jpg",
})

const singleItemTest: CatalogItem = catalogItemFixture()
 

describe("GET /catalog", () => {
    let mongo: MongoMemoryServer;
    const app = createApp();

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


    //Happy Path
    it("returns catalog items", async () => {
        await Catalog.create(singleItemTest);

        const res = await request(app).get("/catalog");

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
    });


    //Shape
    it("returns ")

    //Empty Db
    it('returns an empty array when no items exist', async () => {
        const res = await request(app).get('/catalog');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
});
