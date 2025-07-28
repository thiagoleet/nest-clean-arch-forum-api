import { AnswerAttachment } from '../../enterprise/entities';

export abstract class AnswerAttachmentsRepository {
  abstract createMany(attachments: AnswerAttachment[]): Promise<void>;
  abstract deleteMany(attachments: AnswerAttachment[]): Promise<void>;
  abstract deleteManyByAnswerId(answerId: string): Promise<void>;
  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
}
