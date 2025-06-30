import { z } from 'zod';

export const commentOnAnswerBodySchema = z.object({
  content: z.string(),
});

export type CommentOnAnswerBodySchema = z.infer<
  typeof commentOnAnswerBodySchema
>;
