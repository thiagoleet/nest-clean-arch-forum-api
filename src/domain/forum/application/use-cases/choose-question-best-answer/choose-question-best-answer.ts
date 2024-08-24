import { Either, left, right } from "@/core/either";
import { Question } from "@/domain/forum/enterprise/entities";
import { QuestionsRepository } from "../../repositories/questions.repository";
import { AnswersRepository } from "../../repositories/answers.repository";
import { NotAllowedError, ResourceNotFoundError } from "@/core/errors";

interface ChooseQuestionBestAnswerInput {
  answerId: string;
  authorId: string;
}

type ChooseQuestionBestAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>;
export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerInput): Promise<ChooseQuestionBestAnswerResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError("Answer not found"));
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toString()
    );

    if (!question) {
      return left(new ResourceNotFoundError("Question not found"));
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    question.bestAnswerId = answer.id;

    await this.questionsRepository.save(question);

    return right({ question });
  }
}
