import { Either, left, right } from "@/core/either";
import { AnswersRepository } from "../../repositories/answers.repository";
import { NotAllowedError, ResourceNotFoundError } from "@/core/errors";

interface DeleteAnswerInput {
  answerId: string;
  authorId: string;
}

type DeleteAnswerResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

export class DeleteAnswerUseCase {
  constructor(private repository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerInput): Promise<DeleteAnswerResponse> {
    const answer = await this.repository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError("Question not found"));
    }

    if (authorId != answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.repository.delete(answer);

    return right({});
  }
}
