import {
  calculateOffset,
  ITEMS_PER_PAGE,
  PaginationParams,
} from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { InMemoryStudentsRepository } from './in-memory-students.repository';

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  private _items: QuestionComment[] = [];

  get items() {
    return this._items;
  }

  async create(comment: QuestionComment): Promise<void> {
    this._items.push(comment);
  }

  async findById(id: string): Promise<QuestionComment | null> {
    return this._items.find((comment) => comment.id.toString() === id) ?? null;
  }

  async delete(comment: QuestionComment): Promise<void> {
    this._items = this._items.filter(
      (item) => item.id.toString() !== comment.id.toString(),
    );
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]> {
    const comments = this._items
      .filter((item) => item.questionId.toString() === questionId)
      .slice(...calculateOffset(params.page, ITEMS_PER_PAGE));

    return comments;
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const comments = this._items
      .filter((item) => item.questionId.toString() === questionId)
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
