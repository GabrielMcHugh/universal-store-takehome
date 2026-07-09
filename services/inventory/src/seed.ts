import { Inventory } from "./model/inventory";
import { connectDb, disconnectDb } from "./db/connect";

export async function seedDatabase() {
  await Inventory.deleteMany({});
  await Inventory.create({ sku: "111111", quantity: 3 });
  await Inventory.create({ sku: "222222", quantity: 7 });
  await Inventory.create({ sku: "333333", quantity: 1 });
  await Inventory.create({ sku: "444444", quantity: 0 });
}

if (require.main === module) {
  connectDb()
    .then(() => seedDatabase())
    .then(() => disconnectDb())
    .catch((err) => {
      console.error("Error seeding database:", err);
      process.exit(1);
    });
}
