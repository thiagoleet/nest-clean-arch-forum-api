import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { JwtService } from '@nestjs/jwt';
import { StudentFactory } from 'test/factories/forum/make-sutdent';
import { QuestionFactory } from 'test/factories/forum/make-question';
import { AnswerFactory } from 'test/factories/forum/make-answer';
import { DatabaseModule } from '@/infra/database/database.module';

describe('[E2E] FetchQuestionAnswersController', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get<JwtService>(JwtService);
    studentFactory = moduleRef.get<StudentFactory>(StudentFactory);
    questionFactory = moduleRef.get<QuestionFactory>(QuestionFactory);
    answerFactory = moduleRef.get<AnswerFactory>(AnswerFactory);

    await app.init();
  });

  test(`[GET] /questions/:questionId/answers`, async () => {
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
      answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id,
        content: 'Answer 01',
      }),
      answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id,
        content: 'Answer 02',
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      answers: expect.arrayContaining([
        expect.objectContaining({
          content: 'Answer 01',
        }),
        expect.objectContaining({
          content: 'Answer 02',
        }),
      ]),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
