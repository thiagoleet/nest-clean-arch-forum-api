import {
  calculateOffset,
  ITEMS_PER_PAGE,
  PaginationParams,
} from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { InMemoryStudentsRepository } from './in-memory-students.repository';

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  private _items: AnswerComment[] = [];

  get items() {
    return this._items;
  }

  async create(comment: AnswerComment): Promise<void> {
    this._items.push(comment);
  }

  async findById(id: string): Promise<AnswerComment | null> {
    return this._items.find((comment) => comment.id.toString() === id) || null;
  }

  async delete(comment: AnswerComment): Promise<void> {
    this._items = this._items.filter((item) => item.id !== comment.id);
  }

  async findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]> {
    const comments = this._items
      .filter((item) => item.answerId.toString() === answerId)
      .slice(...calculateOffset(params.page, ITEMS_PER_PAGE));

    return comments;
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const comments = this._items
      .filter((item) => item.answerId.toString() === answerId)
      .slice(...calculateOffset(params.page, ITEMS_PER_PAGE))
      .map((comment) => {
        const author = this.studentsRepository.items.find(
          (student) => student.id.toString() === comment.authorId.toString(),
        );

        if (!author) {
          throw new Error(`Author with ID ${comment.authorId} not found`);
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt ?? null,
          authorId: comment.authorId,
          author: author.name,
        });
      });

    return comments;
  }
}
