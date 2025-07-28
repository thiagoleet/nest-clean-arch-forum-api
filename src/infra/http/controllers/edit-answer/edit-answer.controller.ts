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
  editAnswerBodySchema,
  EditQuestionBodySchema,
} from './edit-answer.schema';

// Pipes
import { ZodValidationPipe } from '../../pipes';

// Use cases
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema);

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private useCase: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
    @Body(bodyValidationPipe) body: EditQuestionBodySchema,
  ) {
    const { content, attachments } = body;

    const result = await this.useCase.execute({
      answerId,
      authorId: user.sub,
      content,
      attachmentIds: attachments,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    return { message: 'Question edited successfully' };
  }
}
