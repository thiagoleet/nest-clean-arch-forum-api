import { z } from 'zod';

export const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
});

export type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;
