import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { QuestionCommentsRepository } from '../../repositories/question-comments.repository';
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors';

interface DeleteQuestionCommentInput {
  authorId: string;
  questionCommentId: string;
}

type DeleteQuestionCommentResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  object
>;

@Injectable()
export class DeleteQuestionCommentUseCase {
  constructor(private repository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentInput): Promise<DeleteQuestionCommentResponse> {
    const comment = await this.repository.findById(questionCommentId);

    if (!comment) {
      return left(new ResourceNotFoundError('Comment not found'));
    }

    if (comment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.repository.delete(comment);

    return right({});
  }
}
