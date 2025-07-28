// nest
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';

// Auth
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/token.schema';

// Schemas
import {
  editQuestionBodySchema,
  EditQuestionBodySchema,
} from './edit-question.schema';

// Pipes
import { ZodValidationPipe } from '../../pipes';

// Use cases
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private useCase: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
    @Body(bodyValidationPipe) body: EditQuestionBodySchema,
  ) {
    const { title, content, attachments } = body;

    const result = await this.useCase.execute({
      title,
      content,
      authorId: user.sub,
      attachmentIds: attachments,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    return { message: 'Question edited successfully' };
  }
}
