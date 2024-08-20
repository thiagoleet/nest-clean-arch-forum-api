import {
  calculateOffset,
  ITEMS_PER_PAGE,
  PaginationParams,
} from "@/core/repositories/pagination-params";
import { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comments.repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities";

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentRepository
{
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
    params: PaginationParams
  ): Promise<AnswerComment[]> {
    const comments = this._items
      .filter((item) => item.answerId.toString() === answerId)
      .slice(...calculateOffset(params.page, ITEMS_PER_PAGE));

    return comments;
  }
}
