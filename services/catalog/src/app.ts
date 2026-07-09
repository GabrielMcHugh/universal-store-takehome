import express, { Request, Response } from "express";
import { Catalog } from "./model/catalog";
import { validateSku } from "./service/validation/sku";
import { createRateLimiter } from "./middleware/rateLimiter";

type AppConfig = {
    clientUrl?: string;
    rateLimit?: {
        enabled?: boolean;
        windowMs?: number;
        max?: number;
    };
}


export function createApp(config: AppConfig = {}) {
    const app = express();

    app.use(express.json())
    app.use(createRateLimiter(config.rateLimit));  

    //Add headers
    app.use(function (_: any, res: any, next: Function) {
        res.header("Access-Control-Allow-Origin", config.clientUrl ?? "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.get("/catalog", async (_: Request, res: Response) => {
        res.json(await Catalog.find());
    });

    app.get("/catalog/:sku", async (req: Request, res: Response) => {
        const sku = validateSku(req.params.sku);

        if (!sku) {
            res.status(400).json({ error: "Invalid SKU format" });
            return;
        }

        const item = await Catalog.findOne({ sku });



        if (!item) {
            res.status(404).json({ error: "Catalog item not found" });
            return;
        }

        res.json(item);
    });

    return app;
}


