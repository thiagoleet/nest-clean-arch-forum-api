import { z } from 'zod';

export const commentOnQuestionBodySchema = z.object({
  content: z.string(),
});

export type CommentOnQuestionBodySchema = z.infer<
  typeof commentOnQuestionBodySchema
>;
