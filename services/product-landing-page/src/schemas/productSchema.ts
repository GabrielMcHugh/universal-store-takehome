import z from 'zod';

export const inStockProductSchema = z.object({
  sku: z.string(),
  title: z.string(),
  price: z.number(),
  image: z.string(),
  quantity: z.number(),
});

export const productsResponseSchema = z.array(inStockProductSchema);
