import { UniqueEntityID } from "@/core/entities";
import { DeleteAnswerUseCase } from "./delete-answer";
import { InMemoryAnswersRepository } from "test/repositories/forum/in-memory-answers.repository";
import { makeAnswer } from "test/factories/forum/make-answer";
import { NotAllowedError, ResourceNotFoundError } from "@/core/errors";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/forum/in-memory-answer-attachments.repository";
import { makeAnswerAttachment } from "test/factories/forum/make-answer-attachment";

describe("DeleteAnswerUseCase", () => {
  let repository: InMemoryAnswersRepository;
  let attachmentsRepository: InMemoryAnswerAttachmentsRepository;
  let sut: DeleteAnswerUseCase;

  beforeEach(() => {
    attachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    repository = new InMemoryAnswersRepository(attachmentsRepository);
    sut = new DeleteAnswerUseCase(repository);
  });

  it("should be able to delete an  answer", async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID("author-1"),
    });
    await repository.create(newAnswer);

    // Pre populating Attachments Repository
    for (let i = 1; i <= 2; i++) {
      await attachmentsRepository.create(
        makeAnswerAttachment({
          answerId: newAnswer.id,
          attachmentId: new UniqueEntityID(`attachment-id-${i}`),
        })
      );
    }

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: "author-1",
    });

    expect(repository.items).toHaveLength(0);
    expect(attachmentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete an answer if not found", async () => {
    const result = await sut.execute({
      answerId: "invalid-id",
      authorId: "author-1",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not allow to delete an answer if the authorId is different", async () => {
    const createQuestion = makeAnswer({
      authorId: new UniqueEntityID("author-1"),
    });
    await repository.create(createQuestion);

    const result = await sut.execute({
      answerId: createQuestion.id.toString(),
      authorId: "wrong-author-id",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
