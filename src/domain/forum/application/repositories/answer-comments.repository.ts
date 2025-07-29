import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerComment } from '../../enterprise/entities';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

export abstract class AnswerCommentsRepository {
  abstract create(comment: AnswerComment): Promise<void>;

  abstract findById(id: string): Promise<AnswerComment | null>;

  abstract delete(comment: AnswerComment): Promise<void>;

  abstract findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>;

  abstract findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]>;
}
