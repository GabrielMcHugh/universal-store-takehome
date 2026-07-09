import express, { Request, Response } from "express";
import { Inventory } from "./model/inventory";
import { validateSku } from "./service/validation/sku";
import { createRateLimiter } from "./middleware/rateLimiter";

type AppConfig = {
  clientUrl?: string;
  rateLimit?: {
    enabled?: boolean;
    windowMs?: number;
    max?: number;
  };
};

export function createApp(config: AppConfig = {}) {
  const app = express();

  app.use(express.json());
  app.use(createRateLimiter(config.rateLimit));

  app.use(function (_: any, res: any, next: Function) {
    res.header("Access-Control-Allow-Origin", config.clientUrl ?? "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.get("/inventory", async (_: Request, res: Response) => {
    res.json(await Inventory.find());
  });

  app.get("/inventory/:sku", async (req: Request, res: Response) => {
    const sku = validateSku(req.params.sku);

    if (!sku) {
      res.status(400).json({ error: "Invalid SKU format" });
      return;
    }

    const item = await Inventory.findOne({ sku });

    if (!item) {
      res.status(404).json({ error: "Inventory item not found" });
      return;
    }

    res.json(item);
  });

  return app;
}
