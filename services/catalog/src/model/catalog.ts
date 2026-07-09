import mongoose, { InferSchemaType } from "mongoose";
import { CatalogItem } from "../types/catalogItem";

const catalogSchema = new mongoose.Schema<CatalogItem>({
  sku: { type: String, unique: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});

export type CatalogDocument = InferSchemaType<typeof catalogSchema>
export const Catalog = mongoose.model<CatalogDocument>('Catalog', catalogSchema);
