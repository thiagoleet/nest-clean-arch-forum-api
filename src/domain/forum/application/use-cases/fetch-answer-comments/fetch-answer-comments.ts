import { AnswerComment } from '@/domain/forum/enterprise/entities';
import { AnswerCommentsRepository } from '../../repositories/answer-comments.repository';
import { Either, right } from '@/core/either';

interface FetchAnswerCommentsInput {
  page: number;
  answerId: string;
}

type FetchAnswerCommentsResponse = Either<
  Error,
  {
    comments: AnswerComment[];
    page: number;
  }
>;

export class FetchAnswerCommentsUseCase {
  constructor(private repository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsInput): Promise<FetchAnswerCommentsResponse> {
    const comments = await this.repository.findManyByAnswerId(answerId, {
      page,
    });

    return right({ comments, page });
  }
}
