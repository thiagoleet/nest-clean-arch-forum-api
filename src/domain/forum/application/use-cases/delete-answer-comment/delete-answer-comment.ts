import { Either, left, right } from '@/core/either';
import { AnswerCommentsRepository } from '../../repositories/answer-comments.repository';
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors';
import { Injectable } from '@nestjs/common';

interface DeleteAnswerCommentInput {
  authorId: string;
  answerCommentId: string;
}

type DeleteAnswerCommentResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>;

@Injectable()
export class DeleteAnswerCommentUseCase {
  constructor(private repository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentInput): Promise<DeleteAnswerCommentResponse> {
    const comment = await this.repository.findById(answerCommentId);

    if (!comment) {
      return left(new ResourceNotFoundError());
    }

    if (comment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.repository.delete(comment);

    return right({});
  }
}
