import {
  calculateOffset,
  ITEMS_PER_PAGE,
  PaginationParams,
} from "@/core/repositories/pagination-params";
import { QuestionCommentRepository } from "@/domain/forum/application/repositories/question-comments.repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities";

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentRepository
{
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
      (item) => item.id.toString() !== comment.id.toString()
    );
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]> {
    const comments = this._items
      .filter((item) => item.questionId.toString() === questionId)
      .slice(...calculateOffset(params.page, ITEMS_PER_PAGE));

    return comments;
  }
}
