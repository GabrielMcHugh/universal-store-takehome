import z from 'zod';
import { inStockProductSchema } from '../schemas/productSchema';

export type InStockProduct = z.infer<typeof inStockProductSchema>;
