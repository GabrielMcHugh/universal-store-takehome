import { Catalog } from "./model/catalog";
import { connectDb, disconnectDb } from "./db/connect";

export async function seedDatabase() {
  await Catalog.deleteMany({});
  await Catalog.create({ sku: "111111", title: "Pen", image: "https://picsum.photos/200", price: 3 });
  await Catalog.create({ sku: "222222", title: "Paper", image: "https://picsum.photos/200", price: 1 });
  await Catalog.create({ sku: "333333", title: "Key", image: "https://picsum.photos/200", price: 7 });
  await Catalog.create({ sku: "444444", title: "Marker", image: "https://picsum.photos/200", price: 2 });
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