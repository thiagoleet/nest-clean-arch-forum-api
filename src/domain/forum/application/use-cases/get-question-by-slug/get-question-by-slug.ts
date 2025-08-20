import { QuestionsRepository } from '../../repositories/questions.repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors';
import { Injectable } from '@nestjs/common';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';

interface GetQuestionBySlugInput {
  slug: string;
}

type GetQuestionBySlugResponse = Either<
  ResourceNotFoundError,
  { question: QuestionDetails }
>;

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private repository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugInput): Promise<GetQuestionBySlugResponse> {
    const question = await this.repository.findDetailsBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError('Question not found'));
    }

    return right({ question });
  }
}
