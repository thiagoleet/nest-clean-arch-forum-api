import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerComment } from '../../enterprise/entities';

export interface AnswerCommentsRepository {
  create(comment: AnswerComment): Promise<void>;
  findById(id: string): Promise<AnswerComment | null>;
  delete(comment: AnswerComment): Promise<void>;
  findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>;
}
