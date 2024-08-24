import { Question } from "@/domain/forum/enterprise/entities";
import { QuestionsRepository } from "../../repositories/questions.repository";

interface FetchRecentQuestionsInput {
  page: number;
}

interface FetchRecentQuestionsResponse {
  questions: Question[];
  page: number;
}

export class FetchRecentQuestionsUseCase {
  constructor(private repository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsInput): Promise<FetchRecentQuestionsResponse> {
    const questions = await this.repository.findManyRecent({ page });

    return { questions, page };
  }
}
