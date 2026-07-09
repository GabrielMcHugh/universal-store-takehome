import express, { NextFunction, Request, Response } from "express";
import { Inventory } from "./model/inventory";
import { validateSku } from "./service/validation/sku";
import { createRateLimiter } from "./middleware/rateLimiter";
import helmet from "helmet";

type AppConfig = {
  clientUrl: string;
  rateLimit?: {
    enabled?: boolean;
    windowMs?: number;
    max?: number;
  };
};

export function createApp(config: AppConfig) {
  if (!config.clientUrl) {
    throw new Error("clientUrl is required");
  }

  const app = express();

  app.use(helmet());
  app.use(express.json());
  app.use(createRateLimiter(config.rateLimit));

  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", config.clientUrl);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");

    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }

    next();
  });

  app.get("/inventory", async (_: Request, res: Response) => {
    res.json(await Inventory.find().select('sku quantity').lean());
  });

  app.get("/inventory/:sku", async (req: Request, res: Response) => {
    const sku = validateSku(req.params.sku);

    if (!sku) {
      res.status(400).json({ error: "Invalid SKU format" });
      return;
    }

    const item = await Inventory.findOne({ sku }).select('sku quantity').lean();

    if (!item) {
      res.status(404).json({ error: "Inventory item not found" });
      return;
    }

    res.json(item);
  });

  return app;
}
