import { z } from 'zod';

export const editAnswerBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()),
});

export type EditQuestionBodySchema = z.infer<typeof editAnswerBodySchema>;
