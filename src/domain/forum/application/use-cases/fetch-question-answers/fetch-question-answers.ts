import { Answer } from '@/domain/forum/enterprise/entities';
import { Either, right } from '@/core/either';
import { AnswersRepository } from '../../repositories/answers.repository';

interface FetchQuestionAnswersInput {
  page: number;
  questionId: string;
}

type FetchQuestionAnswersResponse = Either<
  Error,
  {
    answers: Answer[];
    page: number;
  }
>;

export class FetchQuestionAnswersUseCase {
  constructor(private repository: AnswersRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswersInput): Promise<FetchQuestionAnswersResponse> {
    const answers = await this.repository.findManyByQuestionId(questionId, {
      page,
    });

    return right({ answers, page });
  }
}
