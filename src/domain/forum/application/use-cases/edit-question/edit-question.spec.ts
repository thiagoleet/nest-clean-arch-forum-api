import { InMemoryQuestionsRepository } from "test/repositories/forum/in-memory-questions.repository";
import { EditQuestionUseCase } from "./edit-question";
import { makeQuestion } from "test/factories/forum/make-question";
import { UniqueEntityID } from "@/core/entities";
import { NotAllowedError, ResourceNotFoundError } from "@/core/errors";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/forum/in-memory-question-attachments.repository";
import { makeQuestionAttachment } from "test/factories/forum/make-question-attachment";

describe("EditQuestionUseCase", () => {
  let repository: InMemoryQuestionsRepository;
  let attachmentsRepository: InMemoryQuestionAttachmentsRepository;
  let sut: EditQuestionUseCase;

  beforeEach(() => {
    attachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    repository = new InMemoryQuestionsRepository(attachmentsRepository);
    sut = new EditQuestionUseCase(repository, attachmentsRepository);
  });

  it("should be able to edit a question", async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID("author-1"),
    });
    await repository.create(newQuestion);

    // Pre populating Attachments Repository
    for (let i = 1; i <= 2; i++) {
      await attachmentsRepository.create(
        makeQuestionAttachment({
          questionId: newQuestion.id,
          attachmentId: new UniqueEntityID(`attachment-id-${i}`),
        })
      );
    }

    await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: "author-1",
      title: "New Title",
      content: "New Content",
      attachmentIds: ["attachment-id-1", "attachment-id-3"],
    });

    const [item] = repository.items;

    expect(item).toMatchObject({
      title: "New Title",
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
      questionId: "invalid-id",
      authorId: "author-1",
      title: "New Title",
      content: "New Content",
      attachmentIds: [],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not allow to edit a question if the authorId is different", async () => {
    const createQuestion = makeQuestion({
      authorId: new UniqueEntityID("author-1"),
    });
    await repository.create(createQuestion);

    const result = await sut.execute({
      questionId: createQuestion.id.toString(),
      authorId: "wrong-author-id",
      title: "New Title",
      content: "New Content",
      attachmentIds: [],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
