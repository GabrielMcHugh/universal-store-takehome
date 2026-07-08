import mongoose from 'mongoose';
import { Inventory } from './model/inventory';

const mongoUrl = process.env.MONGO_URL as string;

async function seedDatabase() {
    await mongoose.connect(mongoUrl);
    await Inventory.deleteMany({});
    await Inventory.create({ sku: '111111', quantity: 3 });
    await Inventory.create({ sku: '222222', quantity: 7 });
    await Inventory.create({ sku: '333333', quantity: 1 });
    await Inventory.create({ sku: '444444', quantity: 0 });
    await mongoose.connection.close();
}

seedDatabase().catch(err => {
    console.error('Error seeding database:', err);
    process.exit(1);
});
