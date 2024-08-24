import { EditAnswerUseCase } from "./edit-answer";
import { UniqueEntityID } from "@/core/entities";
import { NotAllowedError, ResourceNotFoundError } from "@/core/errors";
import { InMemoryAnswersRepository } from "test/repositories/forum/in-memory-answers.repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/forum/in-memory-answer-attachments.repository";
import { makeAnswer } from "test/factories/forum/make-answer";
import { makeAnswerAttachment } from "test/factories/forum/make-answer-attachment";

describe("EditAnswerUseCase", () => {
  let repository: InMemoryAnswersRepository;
  let attachmentsRepository: InMemoryAnswerAttachmentsRepository;
  let sut: EditAnswerUseCase;

  beforeEach(() => {
    attachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    repository = new InMemoryAnswersRepository(attachmentsRepository);
    sut = new EditAnswerUseCase(repository, attachmentsRepository);
  });

  it("should be able to edit an answer", async () => {
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
      content: "New Content",
      attachmentIds: ["attachment-id-1", "attachment-id-3"],
    });

    const [item] = repository.items;

    expect(item).toMatchObject({
      content: "New Content",
    });

    expect(item.attachments.currentItems).toHaveLength(2);
    expect(item.attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID("attachment-id-1"),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID("attachment-id-3"),
      }),
    ]);
  });

  it("should not be able to edit a question if not found", async () => {
    const result = await sut.execute({
      answerId: "invalid-id",
      authorId: "author-1",
      content: "New Content",
      attachmentIds: [],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not allow to edit a question if the authorId is different", async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID("author-1"),
    });
    await repository.create(newAnswer);

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: "wrong-author-id",
      content: "New Content",
      attachmentIds: [],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
