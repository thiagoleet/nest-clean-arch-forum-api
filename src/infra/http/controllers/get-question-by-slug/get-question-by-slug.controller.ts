// Nest
import { BadRequestException, Controller, Get, Param } from '@nestjs/common';

// Use cases
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';

// Presenters
import { QuestionDetailsPresenter } from '../../presenters/question-details.presenter';

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private useCase: GetQuestionBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.useCase.execute({ slug });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    const { question } = result.value;

    return {
      question: QuestionDetailsPresenter.toHTTP(question),
    };
  }
}
