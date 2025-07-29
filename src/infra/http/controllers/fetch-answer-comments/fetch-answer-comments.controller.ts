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
} from './fetch-answer-comments.schema';

// Use cases
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';

// Presenters
import { CommentWithAuthorPresenter } from '../../presenters/comment-with-author.presenter';

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private useCase: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamsSchema,
    @Param('answerId') answerId: string,
  ) {
    // TODO: Implement items per page
    const itemsPerPage = 20;

    const result = await this.useCase.execute({
      page,
      answerId,
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
