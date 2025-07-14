// nest
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';

// Auth
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/token.schema';

// Use cases
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment';

@Controller('/answers/comments/:answerCommentId')
export class DeleteAnswerCommentController {
  constructor(private useCase: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('answerCommentId') answerCommentId: string,
  ) {
    const userId = user.sub;

    const result = await this.useCase.execute({
      answerCommentId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    return { message: 'Comment deleted successfully' };
  }
}
