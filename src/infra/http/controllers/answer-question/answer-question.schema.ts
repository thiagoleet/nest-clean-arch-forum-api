import { z } from 'zod';

export const answerQuestionBodySchema = z.object({
  content: z.string(),
});

export type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;
