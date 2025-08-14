import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { JwtService } from '@nestjs/jwt';
import { StudentFactory } from 'test/factories/forum/make-sutdent';
import { DatabaseModule } from '@/infra/database/database.module';
import { QuestionFactory } from 'test/factories/forum/make-question';
import { NotificationFactory } from 'test/factories/notification/make-notification';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('[E2E] ReadNotificationController', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let notificationFactory: NotificationFactory;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, NotificationFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get<StudentFactory>(StudentFactory);
    notificationFactory =
      moduleRef.get<NotificationFactory>(NotificationFactory);

    jwt = moduleRef.get<JwtService>(JwtService);
    prisma = moduleRef.get<PrismaService>(PrismaService);

    await app.init();
  });

  test(`[PATCH] /notifications/:notificationId/read`, async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
    });

    const userId = user.id.toString();

    const accessToken = jwt.sign({ sub: userId });

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id,
      title: 'New Question Created',
      content: 'A new question has been created.',
    });

    const notificationId = notification.id.toString();

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const notificationOnDatabase = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        recipientId: userId,
      },
    });

    expect(notificationOnDatabase?.readAt).not.toBeNull();
  });

  afterAll(async () => {
    await app.close();
  });
});
