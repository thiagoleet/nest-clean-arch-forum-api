// Nest
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

// Schemas
import {
  PageQueryParamsSchema,
  queryValidationPipe,
} from './fetch-question-comments.schema';

// Use cases
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments';

// Presenters
import { CommentWithAuthorPresenter } from '../../presenters/comment-with-author.presenter';

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(private useCase: FetchQuestionCommentsUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamsSchema,
    @Param('questionId') questionId: string,
  ) {
    // TODO: Implement items per page
    const itemsPerPage = 20;

    const result = await this.useCase.execute({
      page,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    const { comments } = result.value;

    return {
      comments: comments.map((comment) =>
        CommentWithAuthorPresenter.toHTTP(comment),
      ),
      page,
      itemsPerPage,
    };
  }
}
