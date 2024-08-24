import { Either, left, right } from "@/core/either";
import { QuestionsRepository } from "../../repositories/questions.repository";
import { NotAllowedError, ResourceNotFoundError } from "@/core/errors";

interface DeleteQuestionInput {
  authorId: string;
  questionId: string;
}

type DeleteQuestionResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

export class DeleteQuestionUseCase {
  constructor(private repository: QuestionsRepository) {}

  async execute({
    questionId,
    authorId,
  }: DeleteQuestionInput): Promise<DeleteQuestionResponse> {
    const question = await this.repository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError("Question not found"));
    }

    if (authorId != question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.repository.delete(question);

    return right({});
  }
}
