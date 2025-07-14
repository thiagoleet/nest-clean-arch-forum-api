import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { JwtService } from '@nestjs/jwt';
import { StudentFactory } from 'test/factories/forum/make-sutdent';
import { QuestionFactory } from 'test/factories/forum/make-question';
import { DatabaseModule } from '@/infra/database/database.module';
import { QuestionCommentFactory } from 'test/factories/forum/make-question-comment';

describe('[E2E] FetchQuestionCommentsController', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let questionCommentFactory: QuestionCommentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get<JwtService>(JwtService);
    studentFactory = moduleRef.get<StudentFactory>(StudentFactory);
    questionFactory = moduleRef.get<QuestionFactory>(QuestionFactory);
    questionCommentFactory = moduleRef.get<QuestionCommentFactory>(
      QuestionCommentFactory,
    );

    await app.init();
  });

  test(`[GET] /questions/:questionId/comments`, async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Question 1',
    });

    await Promise.all([
      questionCommentFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
        content: 'Comment 01',
      }),
      questionCommentFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
        content: 'Comment 02',
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      comments: expect.arrayContaining([
        expect.objectContaining({
          content: 'Comment 01',
        }),
        expect.objectContaining({
          content: 'Comment 02',
        }),
      ]),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
