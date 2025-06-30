import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { QuestionFactory } from 'test/factories/forum/make-question';
import { StudentFactory } from 'test/factories/forum/make-sutdent';
import { AnswerFactory } from 'test/factories/forum/make-answer';
import { QuestionCommentFactory } from 'test/factories/forum/make-question-comment';

describe('[E2E] DeleteQuestionCommentController', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let questionCommentFactory: QuestionCommentFactory;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get<JwtService>(JwtService);
    studentFactory = moduleRef.get<StudentFactory>(StudentFactory);
    questionFactory = moduleRef.get<QuestionFactory>(QuestionFactory);
    prisma = moduleRef.get<PrismaService>(PrismaService);
    questionCommentFactory = moduleRef.get<QuestionCommentFactory>(
      QuestionCommentFactory,
    );

    await app.init();
  });

  test(`[DELETE] /questions/comments/:questionCommentId`, async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Question Created',
    });

    const comment = await questionCommentFactory.makePrismaQuestionComment({
      authorId: user.id,
      questionId: question.id,
      content: 'This is a comment on the question',
    });

    const commentId = comment.id.toString();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .delete(`/questions/comments/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const commentOnDatabase = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    expect(commentOnDatabase).toBeNull();
  });

  afterAll(async () => {
    await app.close();
  });
});
