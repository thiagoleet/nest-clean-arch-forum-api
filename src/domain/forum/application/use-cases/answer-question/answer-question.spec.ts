import { InMemoryAnswersRepository } from "test/repositories/forum/in-memory-answers.repository";
import { AnswerQuestionUseCase } from ".";
import { Answer } from "@/domain/forum/enterprise/entities";
import { UniqueEntityID } from "@/core/entities";

describe("AnswerQuestionUseCase", () => {
  let repository: InMemoryAnswersRepository;
  let sut: AnswerQuestionUseCase;

  beforeEach(() => {
    repository = new InMemoryAnswersRepository();
    sut = new AnswerQuestionUseCase(repository);
  });

  test("create an answer question", async () => {
    const result = await sut.execute({
      questionId: "question-id",
      authorId: "author-id",
      content: "New Answer",
      attachmentIds: ["attachment-id-1", "attachment-id-2"],
    });

    const { answer } = result.value as { answer: Answer };
    const [item] = repository.items;

    expect(answer.content).toBe("New Answer");
    expect(item.id).toEqual(answer.id);
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
