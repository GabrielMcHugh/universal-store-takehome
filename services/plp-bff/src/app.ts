import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { getInStockProducts } from './getInStockProducts';
import { AppConfig } from './types';
import { fetchProductSources } from './upstream';

const openapiPath = path.join(__dirname, '../openapi.yaml');

function requireConfig(config: AppConfig) {
  for (const key of ['clientUrl', 'catalogUrl', 'inventoryUrl'] as const) {
    if (!config[key]) {
      throw new Error(`${key} is required`);
    }
  }
}

export function createApp(config: AppConfig) {
  requireConfig(config);

  const app = express();

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', config.clientUrl);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }

    next();
  });

  const swaggerSetup = swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/openapi.yaml',
    },
  });

  app.get('/docs', swaggerSetup);
  app.use('/docs', swaggerUi.serve);

  app.get('/openapi.yaml', (_req: Request, res: Response) => {
    res.type('application/yaml').sendFile(openapiPath);
  });

  app.get('/products/in-stock', async (_req: Request, res: Response) => {
    try {
      const { catalog, inventory } = await fetchProductSources(config);
      res.json(getInStockProducts(catalog, inventory));
    } catch (err) {
      console.error('Failed to load in-stock products', err);
      res.status(502).json({ error: 'Failed to load products' });
    }
  });

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}
