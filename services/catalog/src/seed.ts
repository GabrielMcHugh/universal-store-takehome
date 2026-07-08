import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL as string;

async function seedDatabase() {
  await mongoose.connect(mongoUrl);
  await mongoose.connection.close();
}

seedDatabase().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
