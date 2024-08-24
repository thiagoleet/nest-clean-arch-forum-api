import { DomainEvents } from "@/core/events";
import {
  calculateOffset,
  ITEMS_PER_PAGE,
  PaginationParams,
} from "@/core/repositories/pagination-params";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments.repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions.repository";
import { Question } from "@/domain/forum/enterprise/entities";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  private _items: Question[];

  get items(): Question[] {
    return this._items;
  }

  constructor(private attachmentsRepository?: QuestionAttachmentsRepository) {
    this._items = [];
  }

  async create(question: Question): Promise<void> {
    this._items.push(question);
    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question): Promise<void> {
    this._items = this._items.filter((item) => item.id !== question.id);

    await this.attachmentsRepository?.deleteManyByQuestionId(
      question.id.toString()
    );
  }

  async findById(id: string): Promise<Question | null> {
    return this._items.find((question) => question.id.toValue() === id) || null;
  }

  async findBySlug(slug: string): Promise<Question | null> {
    return this._items.find((question) => question.slug.value === slug) || null;
  }

  async save(question: Question): Promise<void> {
    const index = this._items.findIndex((item) => item.id === question.id);

    if (index >= 0) {
      this._items[index] = question;
      DomainEvents.dispatchEventsForAggregate(question.id);
    }
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(...calculateOffset(page, ITEMS_PER_PAGE));

    return questions;
  }
}
