import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer: MongoMemoryServer | undefined;

export async function connectDb(): Promise<string> {
  const mongoUrl =
    process.env.MONGO_URL ??
    (await (memoryServer = await MongoMemoryServer.create())).getUri();

  await mongoose.connect(mongoUrl);
  console.log(
    memoryServer
      ? `Connected to in-memory MongoDB at ${mongoUrl}`
      : "Connected to MongoDB"
  );

  return mongoUrl;
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
  await memoryServer?.stop();
}
