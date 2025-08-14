import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '@/core/entities';
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/prisma-notification.mapper';

export function makeNotification(
  overide: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
) {
  const question = Notification.create(
    {
      recipientId: new UniqueEntityID('recipient-id'),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...overide,
    },
    id,
  );

  return question;
}

@Injectable()
export class NotificationFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaNotification(
    data: Partial<NotificationProps> = {},
  ): Promise<Notification> {
    const notification = makeNotification(data);

    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPersistence(notification),
    });

    return notification;
  }
}
