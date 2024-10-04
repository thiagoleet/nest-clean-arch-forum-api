import { z } from 'zod';

export const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

export type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;
