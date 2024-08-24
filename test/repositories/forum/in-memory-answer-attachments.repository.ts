import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments.repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities";

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  private _items: AnswerAttachment[] = [];

  get items() {
    return this._items;
  }

  async create(attachment: AnswerAttachment): Promise<void> {
    this._items.push(attachment);
  }

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    return this._items.filter((item) => item.answerId.toString() === answerId);
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    this._items = this._items.filter(
      (item) => item.answerId.toString() !== answerId
    );
  }
}
