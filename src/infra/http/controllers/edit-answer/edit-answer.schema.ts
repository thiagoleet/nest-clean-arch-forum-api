import { z } from 'zod';

export const editAnswerBodySchema = z.object({
  content: z.string(),
});

export type EditQuestionBodySchema = z.infer<typeof editAnswerBodySchema>;
