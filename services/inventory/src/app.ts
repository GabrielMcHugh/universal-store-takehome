import express, { NextFunction, Request, Response } from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { Inventory } from "./model/inventory";
import { validateSku } from "./service/validation/sku";
import { asyncHandler } from "./middleware/asyncHandler";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { createRateLimiter } from "./middleware/rateLimiter";
import { requestLogger } from "./middleware/requestLogger";
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
  app.use(requestLogger);

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

  // Uptime monitoring stub — e.g. Pingdom polling GET /heartbeat
  //app.get("/heartbeat", (_req, res) => res.sendStatus(200));

  app.use(createRateLimiter(config.rateLimit));

  const openApiPath = path.join(__dirname, "../openapi.yaml");

  app.get("/openapi.yaml", (_req: Request, res: Response) => {
    res.type("application/yaml").sendFile(openApiPath);
  });

  const swaggerOptions = {
    swaggerOptions: {
      url: "/openapi.yaml",
    },
  };

  app.get("/docs", swaggerUi.setup(undefined, swaggerOptions));
  app.use("/docs", swaggerUi.serveFiles(undefined, swaggerOptions));

  app.get("/inventory", asyncHandler(async (_: Request, res: Response) => {
    res.json(await Inventory.find().select('sku quantity').lean());
  }));

  app.get("/inventory/:sku", asyncHandler(async (req: Request, res: Response) => {
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
  }));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
