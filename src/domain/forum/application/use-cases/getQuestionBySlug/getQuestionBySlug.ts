import { Question } from "@/domain/forum/enterprise/entities";
import { QuestionsRepository } from "../../repositories/questions.repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors";

interface GetQuestionBySlugInput {
  slug: string;
}

type GetQuestionBySlugResponse = Either<
  ResourceNotFoundError,
  { question: Question }
>;

export class GetQuestionBySlugUseCase {
  constructor(private repository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugInput): Promise<GetQuestionBySlugResponse> {
    const question = await this.repository.findBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError("Question not found"));
    }

    return right({ question });
  }
}
