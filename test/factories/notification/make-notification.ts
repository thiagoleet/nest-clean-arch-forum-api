import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities";
import {
  Notification,
  NotificationProps,
} from "@/domain/notification/enterprise/entities";

export function makeNotification(
  overide: Partial<NotificationProps> = {},
  id?: UniqueEntityID
) {
  const question = Notification.create(
    {
      recipientId: new UniqueEntityID("recipient-id"),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...overide,
    },
    id
  );

  return question;
}
