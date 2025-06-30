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
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment';

@Controller('/questions/comments/:questionCommentId')
export class DeleteQuestionCommentController {
  constructor(private useCase: DeleteQuestionCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('questionCommentId') questionCommentId: string,
  ) {
    const userId = user.sub;

    const result = await this.useCase.execute({
      questionCommentId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    return { message: 'Comment deleted successfully' };
  }
}
