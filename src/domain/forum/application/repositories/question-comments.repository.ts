import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionComment } from "../../enterprise/entities";

export interface QuestionCommentRepository {
  create(comment: QuestionComment): Promise<void>;
  delete(comment: QuestionComment): Promise<void>;
  findById(id: string): Promise<QuestionComment | null>;
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]>;
}
