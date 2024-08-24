import { InMemoryQuestionsRepository } from "test/repositories/forum/in-memory-questions.repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { InMemoryQuestionCommentsRepository } from "test/repositories/forum/in-memory-question-comments.repository";
import { makeQuestion } from "test/factories/forum/make-question";
import { UniqueEntityID } from "@/core/entities";
import { QuestionComment } from "@/domain/forum/enterprise/entities";
import { ResourceNotFoundError } from "@/core/errors";

describe("CommentOnQuestionUseCase", () => {
  let questionCommentsRepository: InMemoryQuestionCommentsRepository;
  let questionsRepository: InMemoryQuestionsRepository;
  let sut: CommentOnQuestionUseCase;

  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository();
    questionsRepository = new InMemoryQuestionsRepository();
    sut = new CommentOnQuestionUseCase(
      questionCommentsRepository,
      questionsRepository
    );
  });

  it("should be able to comment on a question", async () => {
    const question = makeQuestion({}, new UniqueEntityID("question-id"));
    questionsRepository.items.push(question);

    const { value } = await sut.execute({
      authorId: "instructor-id",
      questionId: "question-id",
      content: "Content",
    });

    const { comment } = value as { comment: QuestionComment };
    const [item] = questionCommentsRepository.items;

    expect(comment.id).toBeTruthy();
    expect(item.id).toEqual(comment.id);
    expect(item.questionId).toEqual(question.id);
  });

  it("should not be able to comment on a question if it not exists/matches", async () => {
    const result = await sut.execute({
      authorId: "instructor-id",
      questionId: "question-id",
      content: "Content",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
