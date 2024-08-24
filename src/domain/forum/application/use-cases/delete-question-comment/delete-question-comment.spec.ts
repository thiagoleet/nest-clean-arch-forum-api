import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { InMemoryQuestionCommentsRepository } from "test/repositories/forum/in-memory-question-comments.repository";
import { UniqueEntityID } from "@/core/entities";
import { makeQuestionComment } from "test/factories/forum/make-question-comment";
import { NotAllowedError, ResourceNotFoundError } from "@/core/errors";

describe("DeleteQuestionCommentUseCase", () => {
  let repository: InMemoryQuestionCommentsRepository;
  let sut: DeleteQuestionCommentUseCase;

  beforeEach(() => {
    repository = new InMemoryQuestionCommentsRepository();
    sut = new DeleteQuestionCommentUseCase(repository);
  });

  it("should be able to delete a comment on a question", async () => {
    const comment = makeQuestionComment(
      {
        authorId: new UniqueEntityID("author-id"),
      },
      new UniqueEntityID("comment-id")
    );
    repository.create(comment);

    await sut.execute({
      authorId: "author-id",
      questionCommentId: "comment-id",
    });

    expect(repository.items).toHaveLength(0);
  });

  it("should not be able to delete a comment on a question if it not exists/matches", async () => {
    const result = await sut.execute({
      authorId: "author-id",
      questionCommentId: "question-id",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to delete another user question comment", async () => {
    const comment = makeQuestionComment(
      { authorId: new UniqueEntityID("author-id") },
      new UniqueEntityID("comment-id")
    );
    repository.create(comment);

    const result = await sut.execute({
      authorId: "wrong-author-id",
      questionCommentId: "comment-id",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
