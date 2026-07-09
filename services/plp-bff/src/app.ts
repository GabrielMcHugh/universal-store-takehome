import express, { NextFunction, Request, Response } from 'express';
import { getInStockProducts } from './getInStockProducts';
import { CatalogItem, InventoryItem } from './types';

type AppConfig = {
  clientUrl: string;
  catalogUrl: string;
  inventoryUrl: string;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${url}`);
  }
  return response.json() as Promise<T>;
}

export function createApp(config: AppConfig) {
  if (!config.clientUrl) {
    throw new Error('clientUrl is required');
  }

  const app = express();

  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', config.clientUrl);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }

    next();
  });

  app.get('/products/in-stock', async (_req: Request, res: Response) => {
    try {
      const [catalog, inventory] = await Promise.all([
        fetchJson<CatalogItem[]>(`${config.catalogUrl}/catalog`),
        fetchJson<InventoryItem[]>(`${config.inventoryUrl}/inventory`),
      ]);

      res.json(getInStockProducts(catalog, inventory));
    } catch (err) {
      console.error('Failed to load in-stock products', err);
      res.status(502).json({ error: 'Failed to load products' });
    }
  });

  return app;
}
