import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/token.schema';
import {
  createQuestionBodySchema,
  CreateQuestionBodySchema,
} from './create-question.schema';
import { ZodValidationPipe } from '../../pipes';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private useCase: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
  ) {
    const { title, content } = body;

    await this.useCase.execute({
      title,
      content,
      authorId: user.sub,
      attachmentIds: [],
    });
  }
}
