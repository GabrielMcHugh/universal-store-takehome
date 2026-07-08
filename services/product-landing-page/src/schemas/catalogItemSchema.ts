import z from "zod";


export const catalogItemSchema = z.object({
  sku: z.string(),
  title: z.string(),
  price: z.number(),
  image: z.string(),
});

export const catalogResponseSchema = z.array(catalogItemSchema)