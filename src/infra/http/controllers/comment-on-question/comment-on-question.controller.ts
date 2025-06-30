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
  commentOnQuestionBodySchema,
  CommentOnQuestionBodySchema,
} from './comment-on-question.schema';

// Pipes
import { ZodValidationPipe } from '../../pipes';
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question';

// Use cases

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema);

@Controller('/questions/:questionId/comment')
export class CommentOnQuestionController {
  constructor(private useCase: CommentOnQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CommentOnQuestionBodySchema,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.useCase.execute({
      content,
      authorId: userId,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return { message: 'Question created successfully' };
  }
}
