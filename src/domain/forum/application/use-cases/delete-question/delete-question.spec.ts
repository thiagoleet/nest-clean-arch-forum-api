import { InMemoryQuestionsRepository } from "test/repositories/forum/in-memory-questions.repository";
import { DeleteQuestionUseCase } from "./delete-question";
import { makeQuestion } from "test/factories/forum/make-question";
import { UniqueEntityID } from "@/core/entities";
import { NotAllowedError, ResourceNotFoundError } from "@/core/errors";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/forum/in-memory-question-attachments.repository";
import { makeQuestionAttachment } from "test/factories/forum/make-question-attachment";

describe("DeleteQuestionUseCase", () => {
  let repository: InMemoryQuestionsRepository;
  let attachmentsRepository: InMemoryQuestionAttachmentsRepository;
  let sut: DeleteQuestionUseCase;

  beforeEach(() => {
    attachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    repository = new InMemoryQuestionsRepository(attachmentsRepository);

    sut = new DeleteQuestionUseCase(repository);
  });

  it("should be able to delete a question", async () => {
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
    });

    expect(repository.items).toHaveLength(0);
    expect(attachmentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a question if not found", async () => {
    const result = await sut.execute({
      questionId: "invalid-id",
      authorId: "author-1",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not allow to delete a question if the authorId is different", async () => {
    const createQuestion = makeQuestion({
      authorId: new UniqueEntityID("author-1"),
    });
    await repository.create(createQuestion);

    const result = await sut.execute({
      questionId: createQuestion.id.toString(),
      authorId: "wrong-author-id",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
