import { InMemoryQuestionsRepository } from "test/repositories/forum/in-memory-questions.repository";
import { makeQuestion } from "test/factories/forum/make-question";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";

describe("FetchRecentQuestionsUseCase", () => {
  let repository: InMemoryQuestionsRepository;
  let sut: FetchRecentQuestionsUseCase;

  beforeEach(() => {
    repository = new InMemoryQuestionsRepository();
    sut = new FetchRecentQuestionsUseCase(repository);
  });

  it("should be able to fetch recent questions", async () => {
    for (let i = 1; i <= 3; i++) {
      const createQuestion = makeQuestion({
        createdAt: new Date(`2024-07-${i.toString().padStart(2, "0")}`),
      });

      await repository.create(createQuestion);
    }

    const { questions } = await sut.execute({
      page: 1,
    });

    expect(questions).toHaveLength(3);
    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date("2024-07-03") }),
      expect.objectContaining({ createdAt: new Date("2024-07-02") }),
      expect.objectContaining({ createdAt: new Date("2024-07-01") }),
    ]);
  });

  it("should be able to fetch paginate recent questions", async () => {
    for (let i = 1; i <= 21; i++) {
      const createQuestion = makeQuestion();

      await repository.create(createQuestion);
    }

    const { questions } = await sut.execute({
      page: 2,
    });

    expect(questions).toHaveLength(1);
  });
});
