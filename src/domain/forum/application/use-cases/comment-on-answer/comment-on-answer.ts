import { AnswerComment } from "@/domain/forum/enterprise/entities";
import { UniqueEntityID } from "@/core/entities";
import { AnswersRepository } from "../../repositories/answers.repository";
import { AnswerCommentRepository } from "../../repositories/answer-comments.repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors";

interface CommentOnAnswerInput {
  authorId: string;
  answerId: string;
  content: string;
}

type CommentOnAnswerResponse = Either<
  ResourceNotFoundError,
  {
    comment: AnswerComment;
  }
>;

export class CommentOnAnswerUseCase {
  constructor(
    private answerCommentsRepository: AnswerCommentRepository,
    private answerssRepository: AnswersRepository
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerInput): Promise<CommentOnAnswerResponse> {
    const answer = await this.answerssRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError("Answer not found"));
    }

    const comment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      answerId: answer.id,
      content,
    });

    await this.answerCommentsRepository.create(comment);

    return right({ comment });
  }
}
