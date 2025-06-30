import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { QuestionFactory } from 'test/factories/forum/make-question';
import { StudentFactory } from 'test/factories/forum/make-sutdent';

describe('[E2E] DeleteQuestionController', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get<JwtService>(JwtService);
    studentFactory = moduleRef.get<StudentFactory>(StudentFactory);
    questionFactory = moduleRef.get<QuestionFactory>(QuestionFactory);
    prisma = moduleRef.get<PrismaService>(PrismaService);

    await app.init();
  });

  test(`[DELETE] questions/:id`, async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Question Created',
    });

    const questionId = question.id.toString();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .delete(`/questions/${questionId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const questionOnDatabase = await prisma.question.findUnique({
      where: { id: questionId },
    });

    expect(questionOnDatabase).toBeNull();
  });

  afterAll(async () => {
    await app.close();
  });
});
