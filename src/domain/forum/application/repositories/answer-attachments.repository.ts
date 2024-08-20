import { AnswerAttachment } from "../../enterprise/entities";

export interface AnswerAttachmentsRepository {
  create(attachment: AnswerAttachment): Promise<void>;
  deleteManyByAnswerId(answerId: string): Promise<void>;
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
}
