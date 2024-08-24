import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { UniqueEntityID } from "@/core/entities";
import { InMemoryAnswerCommentsRepository } from "test/repositories/forum/in-memory-answer-comments.repository";
import { makeAnswerComment } from "test/factories/forum/make-answer-comment";

describe("FetchAnswerCommentsUseCase", () => {
  let repository: InMemoryAnswerCommentsRepository;
  let sut: FetchAnswerCommentsUseCase;

  beforeEach(() => {
    repository = new InMemoryAnswerCommentsRepository();
    sut = new FetchAnswerCommentsUseCase(repository);
  });

  it("should be able fetch answer comments", async () => {
    for (let i = 1; i <= 3; i++) {
      const comment = makeAnswerComment({
        answerId: new UniqueEntityID("answer-id"),
      });

      await repository.create(comment);
    }

    const { comments } = await sut.execute({
      page: 1,
      answerId: "answer-id",
    });

    expect(comments).toHaveLength(3);
  });

  it("should be able to fetch paginate answers comments", async () => {
    for (let i = 1; i <= 21; i++) {
      const createdAnswer = makeAnswerComment({
        answerId: new UniqueEntityID("answer-id"),
      });

      await repository.create(createdAnswer);
    }

    const { comments } = await sut.execute({
      answerId: "answer-id",
      page: 2,
    });

    expect(comments).toHaveLength(1);
  });
});
