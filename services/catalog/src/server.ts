import { createApp } from "./app";
import { connectDb } from "./db/connect";
import { seedDatabase } from "./seed";

const clientUrl = process.env.CLIENT_URL ?? "http://localhost:8080";
const port = 3000;

async function start() {
  await connectDb();
  await seedDatabase();

  const app = createApp({ clientUrl });
  app.listen(port, () => {
    console.log(`Catalog service is running at http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error("Could not start catalog service", err);
  process.exit(1);
});