import express from "express";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL as string;
const clientUrl = process.env.CLIENT_URL as string;

mongoose
    .connect(mongoUrl)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB", err));

const app = express();
const port = 3000;
app.use(express.json());

app.use(function(_: any, res: any, next: Function) {
    res.header("Access-Control-Allow-Origin", clientUrl);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(port, () => {
    console.log(`Catalog service is running at http://localhost:${port}`);
});
