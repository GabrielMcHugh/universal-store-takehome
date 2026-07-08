import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from './app';
import { Catalog } from './model/catalog';

//Happy Path
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

    it("returns catalog items", async () => {
        await Catalog.create({
            sku: "SKU-001",
            title: "Test Product",
            price: 29.99,
            image: "https://example.com/image.jpg",
        });

        const res = await request(app).get("/catalog");

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
    });
});
