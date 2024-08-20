import { makeQuestion } from "test/factories/forum/make-question";
import { FetchQuestionAnswersUseCase } from "./fetch-question-answers";
import { InMemoryAnswersRepository } from "test/repositories/forum/in-memory-answers.repository";
import { makeAnswer } from "test/factories/forum/make-answer";
import { UniqueEntityID } from "@/core/entities";

describe("FetchQuestionAnswersUseCase", () => {
  let repository: InMemoryAnswersRepository;
  let sut: FetchQuestionAnswersUseCase;

  beforeEach(() => {
    repository = new InMemoryAnswersRepository();
    sut = new FetchQuestionAnswersUseCase(repository);
  });

  it("should be able fetch question answers", async () => {
    for (let i = 1; i <= 3; i++) {
      const createAnswer = makeAnswer({
        questionId: new UniqueEntityID("question-id"),
      });

      await repository.create(createAnswer);
    }

    const { answers } = await sut.execute({
      page: 1,
      questionId: "question-id",
    });

    expect(answers).toHaveLength(3);
  });

  it("should be able to fetch paginate questions answers", async () => {
    for (let i = 1; i <= 21; i++) {
      const createdAnswer = makeAnswer({
        questionId: new UniqueEntityID("question-id"),
      });

      await repository.create(createdAnswer);
    }

    const { answers } = await sut.execute({
      questionId: "question-id",
      page: 2,
    });

    expect(answers).toHaveLength(1);
  });
});
