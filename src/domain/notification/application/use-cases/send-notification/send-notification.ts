import { UniqueEntityID } from "@/core/entities";
import { Either, right } from "@/core/either";
import { Notification } from "@/domain/notification/enterprise/entities";
import { NotificationsRepository } from "../../repositories/notifications.repository";

export interface SendNotificationInput {
  receipientId: string;
  title: string;
  content: string;
}

export type SendNotificationResponse = Either<
  null,
  { notification: Notification }
>;

export class SendNotificationUseCase {
  constructor(private repository: NotificationsRepository) {}

  async execute({
    receipientId,
    title,
    content,
  }: SendNotificationInput): Promise<SendNotificationResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(receipientId),
      title,
      content,
    });

    await this.repository.create(notification);

    return right({
      notification,
    });
  }
}
