import { QuestionAttachment } from '../../enterprise/entities';

export abstract class QuestionAttachmentsRepository {
  // create(attachment: QuestionAttachment): Promise<void>;
  abstract deleteManyByQuestionId(questionId: string): Promise<void>;
  abstract findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]>;
}
