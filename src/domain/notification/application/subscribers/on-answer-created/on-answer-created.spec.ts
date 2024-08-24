import { vi, MockInstance } from "vitest";
import { makeAnswer } from "test/factories/forum/make-answer";
import { OnAnswerCreated } from "./on-answer-created";
import { InMemoryAnswersRepository } from "test/repositories/forum/in-memory-answers.repository";
import { InMemoryQuestionsRepository } from "test/repositories/forum/in-memory-questions.repository";
import { SendNotificationUseCase } from "../../use-cases/send-notification";
import { InMemoryNotificationsRepository } from "test/repositories/notification/in-memory-notifications.repository";
import { makeQuestion } from "test/factories/forum/make-question";
import { waitFor } from "test/utils/wait-for";

describe("OnAnswerCreated", () => {
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

    new OnAnswerCreated(questionsRepository, sendNotificationUseCase);
  });

  it("should send a notification when an answer is created", async () => {
    // Creating a question
    const question = makeQuestion();
    await questionsRepository.create(question);

    // Creating an answer
    const answer = makeAnswer({ questionId: question.id });
    await answersRepository.create(answer);

    // Checking if the notification was sent
    await waitFor(() => {
      expect(sendNotificationSpy).toHaveBeenCalled();
    });
  });
});
