import { Question } from '@/domain/forum/enterprise/entities';
import { QuestionsRepository } from '../../repositories/questions.repository';
import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';

interface FetchRecentQuestionsInput {
  page: number;
}

type FetchRecentQuestionsResponse = Either<
  Error,
  {
    questions: Question[];
    page: number;
  }
>;

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private repository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsInput): Promise<FetchRecentQuestionsResponse> {
    const questions = await this.repository.findManyRecent({ page });

    return right({ questions, page });
  }
}
