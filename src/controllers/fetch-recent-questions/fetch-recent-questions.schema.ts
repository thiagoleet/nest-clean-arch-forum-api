import { ZodValidationPipe } from '@/pipes';
import { z } from 'zod';

export const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().int().min(1));

export type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>;

export const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);
