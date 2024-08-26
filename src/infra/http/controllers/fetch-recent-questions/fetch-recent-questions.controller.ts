import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import {
  PageQueryParamsSchema,
  queryValidationPipe,
} from './fetch-recent-questions.schema';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { QuestionPresenter } from '../../presenters/question.presenter';

@Controller('/questions')
@UseGuards(JwtAuthGuard)
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
      // TODO: Implement an Error
      throw new Error('Unexpected error');
    }

    const { questions } = result.value;

    return {
      questions: questions.map(QuestionPresenter.toHTTP),
      page,
      itemsPerPage,
    };
  }
}
