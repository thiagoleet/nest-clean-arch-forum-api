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
  commentOnAnswerBodySchema,
  CommentOnAnswerBodySchema,
} from './comment-on-answer.schema';

// Pipes
import { ZodValidationPipe } from '../../pipes';

// Use cases
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer';

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema);

@Controller('/answers/:answerId/comment')
export class CommentOnAnswerController {
  constructor(private useCase: CommentOnAnswerUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
    @Param('answerId') answerId: string,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.useCase.execute({
      content,
      authorId: userId,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return { message: 'Comment created successfully' };
  }
}
