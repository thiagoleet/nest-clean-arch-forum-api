import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import {
  PageQueryParamsSchema,
  queryValidationPipe,
} from './fetch-recent-questions.schema';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private useCase: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamsSchema,
  ) {
    const itemsPerPage = 20;

    const { questions } = await this.useCase.execute({
      page,
    });

    return { questions, page, itemsPerPage };
  }
}
