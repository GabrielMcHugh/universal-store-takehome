import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { createApp } from "./app";

const mongoUrl = process.env.MONGO_URL as string;
const clientUrl = process.env.CLIENT_URL as string;
const port = 3000;

async function start() {
    await mongoose
        .connect(mongoUrl)
        .then(() => console.log("Connected to MongoDB"))

    const app = createApp({clientUrl})
    app.listen(port, () => {
        console.log(`Catalog service is running at http://localhost:${port}`);
    });

}

start().catch((err) => {
    console.error("Could not connect to MongoDB", err);
    process.exit(1)
});