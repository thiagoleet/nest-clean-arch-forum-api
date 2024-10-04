// nest
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';

// Auth
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/token.schema';

// Schemas
import {
  answerQuestionBodySchema,
  AnswerQuestionBodySchema,
} from './answer-question.schema';

// Pipes
import { ZodValidationPipe } from '../../pipes';

// Use cases
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema);

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private useCase: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.useCase.execute({
      content,
      authorId: userId,
      questionId,
      attachmentIds: [],
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return { message: 'Question created successfully' };
  }
}
