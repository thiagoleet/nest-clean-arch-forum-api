import request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { AnswerFactory } from 'test/factories/forum/make-answer';
import { QuestionFactory } from 'test/factories/forum/make-question';
import { StudentFactory } from 'test/factories/forum/make-sutdent';

import { PrismaService } from '../database/prisma/prisma.service';
import { DatabaseModule } from '../database/database.module';
import { AppModule } from '../app.module';
import { waitFor } from 'test/utils/wait-for';
import { DomainEvents } from '@/core/events';

describe('[E2E] On Question Best Answer Chosen', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let prisma: PrismaService;

  beforeAll(async () => {
    DomainEvents.shouldRun = true;

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get<JwtService>(JwtService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
    studentFactory = moduleRef.get<StudentFactory>(StudentFactory);
    questionFactory = moduleRef.get<QuestionFactory>(QuestionFactory);
    answerFactory = moduleRef.get<AnswerFactory>(AnswerFactory);

    await app.init();
  });

  it('Should send a notification when question best answer is chosen', async () => {
    const user = await studentFactory.makePrismaStudent();
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Question Created',
    });

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
      content: 'Answer 01',
    });

    const answerId = answer.id.toString();

    await request(app.getHttpServer())
      .patch(`/answers/${answerId}/choose-as-best`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: user.id.toString(),
        },
      });

      expect(notificationOnDatabase).not.toBeNull();
    });
  });
});
