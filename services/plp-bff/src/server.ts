import { createApp } from './app';

const clientUrl = process.env.CLIENT_URL ?? 'http://localhost:8080';
const catalogUrl = process.env.CATALOG_URL ?? 'http://localhost:3000';
const inventoryUrl = process.env.INVENTORY_URL ?? 'http://localhost:4000';
const port = 5000;

const app = createApp({ clientUrl, catalogUrl, inventoryUrl });

app.listen(port, () => {
  console.log(`PLP BFF is running at http://localhost:${port}`);
});
