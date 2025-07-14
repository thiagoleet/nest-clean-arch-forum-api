import { QuestionComment } from '@/domain/forum/enterprise/entities';
import { QuestionCommentsRepository } from '../../repositories/question-comments.repository';
import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';

interface FetchQuestionCommentsInput {
  page: number;
  questionId: string;
}

type FetchQuestionCommentsResponse = Either<
  Error,
  {
    comments: QuestionComment[];
    page: number;
  }
>;

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(private repository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsInput): Promise<FetchQuestionCommentsResponse> {
    const comments = await this.repository.findManyByQuestionId(questionId, {
      page,
    });

    return right({ comments, page });
  }
}
