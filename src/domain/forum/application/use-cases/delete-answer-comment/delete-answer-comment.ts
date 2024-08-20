import { Either, left, right } from "@/core/either";
import { AnswerCommentRepository } from "../../repositories/answer-comments.repository";
import { NotAllowedError, ResourceNotFoundError } from "@/core/errors";

interface DeleteAnswerCommentInput {
  authorId: string;
  answerCommentId: string;
}

type DeleteAnswerCommentResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

export class DeleteAnswerCommentUseCase {
  constructor(private repository: AnswerCommentRepository) {}

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
