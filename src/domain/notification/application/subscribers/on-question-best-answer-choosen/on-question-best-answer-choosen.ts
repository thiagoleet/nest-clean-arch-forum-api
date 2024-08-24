import { DomainEvents, EventHandler } from "@/core/events";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers.repository";
import { SendNotificationUseCase } from "../../use-cases/send-notification";
import { QuestionBestAnswerChoosenEvent } from "@/domain/forum/enterprise/events";

export class OnQuestionBestAnswerChoosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendBestAnswerChoosenNotification.bind(this),
      QuestionBestAnswerChoosenEvent.name
    );
  }

  private async sendBestAnswerChoosenNotification(
    event: QuestionBestAnswerChoosenEvent
  ): Promise<void> {
    const { question, bestAnswerId } = event;

    const answer = await this.answersRepository.findById(
      bestAnswerId.toString()
    );

    if (answer) {
      await this.sendNotification.execute({
        receipientId: answer.authorId.toString(),
        title: `Your answer was choosen as the best answer to ${question.title.substring(0, 40).concat("…")}`,
        content: `The answer you provided in ${question.title.substring(0, 20).concat("…")} was choosen as the best answer. Congratulations!`,
      });
    }
  }
}
