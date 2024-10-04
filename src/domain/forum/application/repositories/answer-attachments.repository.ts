import { AnswerAttachment } from '../../enterprise/entities';

export abstract class AnswerAttachmentsRepository {
  // create(attachment: AnswerAttachment): Promise<void>;
  abstract deleteManyByAnswerId(answerId: string): Promise<void>;
  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
}
