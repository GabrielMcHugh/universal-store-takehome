import express, { Request, Response } from "express";
import { Catalog } from "./model/catalog";

type AppConfig = {
    clientUrl?: string;
}


export function createApp(config: AppConfig = {}) {
    const app = express();

    app.use(express.json())

    //Add headers
    app.use(function (_: any, res: any, next: Function) {
        res.header("Access-Control-Allow-Origin", config.clientUrl ?? "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.get("/catalog", async(_: Request, res: Response) => {
        res.json(await Catalog.find());
    })

    return app;
}

