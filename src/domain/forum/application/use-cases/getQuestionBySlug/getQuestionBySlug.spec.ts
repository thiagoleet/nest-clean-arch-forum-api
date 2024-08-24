import { InMemoryQuestionsRepository } from "test/repositories/forum/in-memory-questions.repository";
import { GetQuestionBySlugUseCase } from "./getQuestionBySlug";
import { makeQuestion } from "test/factories/forum/make-question";
import { Question } from "@/domain/forum/enterprise/entities";
import { ResourceNotFoundError } from "@/core/errors";

describe("GetQuestionBySlugUseCase", () => {
  let repository: InMemoryQuestionsRepository;
  let sut: GetQuestionBySlugUseCase;

  beforeEach(() => {
    repository = new InMemoryQuestionsRepository();
    sut = new GetQuestionBySlugUseCase(repository);
  });

  it("should be able to get a question by slug", async () => {
    const createQuestion = makeQuestion({
      title: "New Question",
    });

    await repository.create(createQuestion);

    const { value } = await sut.execute({
      slug: "new-question",
    });

    const { question } = value as { question: Question };

    expect(question.slug.value).toBe("new-question");
  });

  it("should not be able to get a question by slug", async () => {
    const result = await sut.execute({
      slug: "new-question",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
