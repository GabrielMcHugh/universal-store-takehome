import express, { Request, Response } from "express";
import { Inventory } from "./model/inventory";

type AppConfig = {
  clientUrl?: string;
};

export function createApp(config: AppConfig = {}) {
  const app = express();

  app.use(express.json());

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
    res.json(await Inventory.find({ sku: req.params.sku }));
  });

  return app;
}
