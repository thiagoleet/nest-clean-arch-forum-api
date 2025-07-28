import { z } from 'zod';

export const answerQuestionBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()),
});

export type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;
