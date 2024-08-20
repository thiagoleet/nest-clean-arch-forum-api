import { InMemoryAnswersRepository } from "test/repositories/forum/in-memory-answers.repository";
import { InMemoryQuestionsRepository } from "test/repositories/forum/in-memory-questions.repository";
import { InMemoryNotificationsRepository } from "test/repositories/notification/in-memory-notifications.repository";
import { SendNotificationUseCase } from "../../use-cases/send-notification";
import { MockInstance } from "vitest";
import { OnQuestionBestAnswerChoosen } from "./on-question-best-answer-choosen";
import { makeQuestion } from "test/factories/forum/make-question";
import { makeAnswer } from "test/factories/forum/make-answer";
import { waitFor } from "test/utils/wait-for";

describe("OnQuestionBestAnswerChoosen", () => {
  let answersRepository: InMemoryAnswersRepository;
  let questionsRepository: InMemoryQuestionsRepository;
  let sendNotificationUseCase: SendNotificationUseCase;
  let notificationsRepository: InMemoryNotificationsRepository;

  let sendNotificationSpy: MockInstance;

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository();
    questionsRepository = new InMemoryQuestionsRepository();
    notificationsRepository = new InMemoryNotificationsRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository
    );

    sendNotificationSpy = vi.spyOn(sendNotificationUseCase, "execute");

    new OnQuestionBestAnswerChoosen(answersRepository, sendNotificationUseCase);
  });

  it("should send notification when question has best answer choosen", async () => {
    // Creating a question
    const question = makeQuestion();
    await questionsRepository.create(question);

    // Creating an answer
    const answer = makeAnswer({ questionId: question.id });
    await answersRepository.create(answer);

    // Choosing a best answer
    question.bestAnswerId = answer.id;
    await questionsRepository.save(question);

    // Checking if the notification was sent
    await waitFor(() => {
      expect(sendNotificationSpy).toHaveBeenCalled();
    });
  });
});
