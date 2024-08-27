// Nest
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';

// Schemas
import {
  PageQueryParamsSchema,
  queryValidationPipe,
} from './fetch-recent-questions.schema';

// Use cases
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';

// Presenters
import { QuestionPresenter } from '../../presenters/question.presenter';

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private useCase: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamsSchema,
  ) {
    // TODO: Implement items per page
    const itemsPerPage = 20;

    const result = await this.useCase.execute({
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    const { questions } = result.value;

    return {
      questions: questions.map(QuestionPresenter.toHTTP),
      page,
      itemsPerPage,
    };
  }
}
