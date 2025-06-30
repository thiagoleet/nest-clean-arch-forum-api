// Nest
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

// Schemas
import {
  PageQueryParamsSchema,
  queryValidationPipe,
} from './fetch-question-answers.schema';

// Use cases
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers';

// Presenters
// import { QuestionPresenter } from '../../presenters/question.presenter';

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(private useCase: FetchQuestionAnswersUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamsSchema,
    @Param('questionId') questionId: string,
  ) {
    // TODO: Implement items per page
    const itemsPerPage = 20;

    const result = await this.useCase.execute({
      page,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    const { answers } = result.value;

    return {
      answers,
      page,
      itemsPerPage,
    };
  }
}
