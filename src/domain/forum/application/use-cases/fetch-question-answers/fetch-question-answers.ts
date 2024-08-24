import { Answer } from "@/domain/forum/enterprise/entities";
import { AnswersRepository } from "../../repositories/answers.repository";

interface FetchQuestionAnswersInput {
  page: number;
  questionId: string;
}

interface FetchQuestionAnswersResponse {
  answers: Answer[];
}

export class FetchQuestionAnswersUseCase {
  constructor(private repository: AnswersRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswersInput): Promise<FetchQuestionAnswersResponse> {
    const answers = await this.repository.findManyByQuestionId(questionId, {
      page,
    });

    return { answers };
  }
}
