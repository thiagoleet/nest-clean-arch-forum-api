import { DomainEvents } from '@/core/events';
import {
  calculateOffset,
  ITEMS_PER_PAGE,
  PaginationParams,
} from '@/core/repositories/pagination-params';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import { Question } from '@/domain/forum/enterprise/entities';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { InMemoryAttachmentssRepository } from './in-memory-attachments.repository';
import { InMemoryStudentsRepository } from './in-memory-students.repository';
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments.repository';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  private _items: Question[];

  get items(): Question[] {
    return this._items;
  }

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentRespository: InMemoryAttachmentssRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {
    this._items = [];
  }

  async create(question: Question): Promise<void> {
    this._items.push(question);
    await this.questionAttachmentsRepository?.createMany(
      question.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question): Promise<void> {
    this._items = this._items.filter((item) => item.id !== question.id);

    await this.questionAttachmentsRepository?.deleteManyByQuestionId(
      question.id.toString(),
    );
  }

  async findById(id: string): Promise<Question | null> {
    return this._items.find((question) => question.id.toValue() === id) || null;
  }

  async findBySlug(slug: string): Promise<Question | null> {
    return this._items.find((question) => question.slug.value === slug) || null;
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = this._items.find(
      (question) => question.slug.value === slug,
    );

    if (!question) {
      return null;
    }

    const author = await this.studentsRepository.items.find((student) =>
      student.id.equals(question.authorId),
    );

    if (!author) {
      throw new Error(
        `Author with given ID ${question.authorId.toString()} does not exist`,
      );
    }

    const questionAttachments =
      await this.questionAttachmentsRepository.items.filter((attachment) =>
        attachment.questionId.equals(question.id),
      );

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentRespository.items.find((att) => {
        return att.id.equals(questionAttachment.attachmentId);
      });

      if (!attachment) {
        throw new Error(
          `Attachment with given ID ${questionAttachment.attachmentId.toString()} does not exist`,
        );
      }

      return attachment;
    });

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      authorName: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      bestAnswerId: question.bestAnswerId,
      attachments,
    });
  }

  async save(question: Question): Promise<void> {
    const index = this._items.findIndex((item) => item.id === question.id);

    if (index >= 0) {
      this._items[index] = question;

      await this.questionAttachmentsRepository?.createMany(
        question.attachments.getNewItems(),
      );

      await this.questionAttachmentsRepository?.deleteMany(
        question.attachments.getRemovedItems(),
      );

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
