import express, { NextFunction, Request, Response } from "express";
import { Catalog } from "./model/catalog";
import { validateSku } from "./service/validation/sku";
import { asyncHandler } from "./middleware/asyncHandler";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { createRateLimiter } from "./middleware/rateLimiter";
import helmet from "helmet";

type AppConfig = {
    clientUrl: string;
    rateLimit?: {
        enabled?: boolean;
        windowMs?: number;
        max?: number;
    };
}


export function createApp(config: AppConfig) {
    if (!config.clientUrl) {
        throw new Error("clientUrl is required");
    }

    const app = express();

    app.use(helmet());
    app.use(express.json());

    app.use(function (req: Request, res: Response, next: NextFunction) {
        res.header("Access-Control-Allow-Origin", config.clientUrl);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, OPTIONS");

        if (req.method === "OPTIONS") {
          res.sendStatus(204);
          return;
        }
        next();
    });

    app.use(createRateLimiter(config.rateLimit));

    app.get("/catalog", asyncHandler(async (_: Request, res: Response) => {
        res.json(await Catalog.find().select('sku title price image').lean());
    }));

    app.get("/catalog/:sku", asyncHandler(async (req: Request, res: Response) => {
        const sku = validateSku(req.params.sku);

        if (!sku) {
            res.status(400).json({ error: "Invalid SKU format" });
            return;
        }

        const item = await Catalog.findOne({ sku }).select('sku title price image').lean();

        if (!item) {
            res.status(404).json({ error: "Catalog item not found" });
            return;
        }

        res.json(item);
    }));

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}

