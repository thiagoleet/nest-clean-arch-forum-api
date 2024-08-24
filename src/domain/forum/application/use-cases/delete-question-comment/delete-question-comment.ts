import { Either, left, right } from "@/core/either";
import { QuestionCommentRepository } from "../../repositories/question-comments.repository";
import { NotAllowedError, ResourceNotFoundError } from "@/core/errors";

interface DeleteQuestionCommentInput {
  authorId: string;
  questionCommentId: string;
}

type DeleteQuestionCommentResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {}
>;

export class DeleteQuestionCommentUseCase {
  constructor(private repository: QuestionCommentRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentInput): Promise<DeleteQuestionCommentResponse> {
    const comment = await this.repository.findById(questionCommentId);

    if (!comment) {
      return left(new ResourceNotFoundError("Comment not found"));
    }

    if (comment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.repository.delete(comment);

    return right({});
  }
}
