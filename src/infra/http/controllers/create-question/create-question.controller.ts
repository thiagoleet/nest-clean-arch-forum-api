// nest
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

// Auth
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/token.schema';

// Schemas
import {
  createQuestionBodySchema,
  CreateQuestionBodySchema,
} from './create-question.schema';

// Pipes
import { ZodValidationPipe } from '../../pipes';

// Use cases
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

@Controller('/questions')
export class CreateQuestionController {
  constructor(private useCase: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
  ) {
    const { title, content, attachments } = body;

    const result = await this.useCase.execute({
      title,
      content,
      authorId: user.sub,
      attachmentIds: attachments,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    return { message: 'Question created successfully' };
  }
}
