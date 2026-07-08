import mongoose from "mongoose";

const catalogSchema = new mongoose.Schema({
  sku: { type: String, unique: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});

export const Catalog = mongoose.model('Catalog', catalogSchema);
