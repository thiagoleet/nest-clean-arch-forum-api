import { InMemoryQuestionsRepository } from "test/repositories/forum/in-memory-questions.repository";
import { CreateQuestionUseCase } from "./create-question";
import { Question } from "@/domain/forum/enterprise/entities";
import { UniqueEntityID } from "@/core/entities";

describe("CreateQuestionUseCase", () => {
  let repository: InMemoryQuestionsRepository;
  let sut: CreateQuestionUseCase;

  beforeEach(() => {
    repository = new InMemoryQuestionsRepository();
    sut = new CreateQuestionUseCase(repository);
  });

  it("should be able to create an answer question", async () => {
    const { value } = await sut.execute({
      authorId: "instructor-id",
      title: "New Question",
      content: "Content",
      attachmentIds: ["attachment-id-1", "attachment-id-2"],
    });

    const { question } = value as { question: Question };
    const [item] = repository.items;

    expect(question.id).toBeTruthy();
    expect(item.id).toEqual(question.id);
    expect(item.attachments.currentItems).toHaveLength(2);
    expect(item.attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID("attachment-id-1"),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID("attachment-id-2"),
      }),
    ]);
  });
});
