import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities';

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  private _items: QuestionAttachment[] = [];

  get items() {
    return this._items;
  }

  async create(attachment: QuestionAttachment): Promise<void> {
    this._items.push(attachment);
  }

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    return this._items.filter(
      (item) => item.questionId.toString() === questionId,
    );
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    this._items = this._items.filter(
      (item) => item.questionId.toString() !== questionId,
    );
  }

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this._items.push(...attachments);
  }
  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    const questionAttachments = this._items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item));
    });

    this._items = questionAttachments;
  }
}
