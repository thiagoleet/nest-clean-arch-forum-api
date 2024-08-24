import { Either, left, right } from "@/core/either";
import { NotAllowedError, ResourceNotFoundError } from "@/core/errors";
import { NotificationsRepository } from "../../repositories/notifications.repository";
import { Notification } from "@/domain/notification/enterprise/entities";

interface ReadNotificationInput {
  receipientId: string;
  notificationId: string;
}

type ReadNotificationResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { notification: Notification }
>;

export class ReadNotificationUseCase {
  constructor(private repository: NotificationsRepository) {}

  async execute({
    receipientId,
    notificationId,
  }: ReadNotificationInput): Promise<ReadNotificationResponse> {
    const notification = await this.repository.findById(notificationId);

    if (!notification) {
      return left(new ResourceNotFoundError("Notification not found"));
    }

    if (notification.recipientId.toString() !== receipientId) {
      return left(
        new NotAllowedError("You are not allowed to read this notification")
      );
    }

    notification.read();

    await this.repository.save(notification);

    return right({ notification });
  }
}
