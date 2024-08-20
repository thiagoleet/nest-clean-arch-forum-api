import { AnswerComment } from "@/domain/forum/enterprise/entities";
import { AnswerCommentRepository } from "../../repositories/answer-comments.repository";

interface FetchAnswerCommentsInput {
  page: number;
  answerId: string;
}

interface FetchAnswerCommentsResponse {
  comments: AnswerComment[];
}

export class FetchAnswerCommentsUseCase {
  constructor(private repository: AnswerCommentRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsInput): Promise<FetchAnswerCommentsResponse> {
    const comments = await this.repository.findManyByAnswerId(answerId, {
      page,
    });

    return { comments };
  }
}
