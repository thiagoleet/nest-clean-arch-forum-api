import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { JwtService } from '@nestjs/jwt';
import { StudentFactory } from 'test/factories/forum/make-sutdent';
import { QuestionFactory } from 'test/factories/forum/make-question';
import { DatabaseModule } from '@/infra/database/database.module';

describe('[E2E] FetchRecentQuestionsController', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get<JwtService>(JwtService);
    studentFactory = moduleRef.get<StudentFactory>(StudentFactory);
    questionFactory = moduleRef.get<QuestionFactory>(QuestionFactory);

    await app.init();
  });

  test(`[GET] questions`, async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    await Promise.all([
      questionFactory.makePrismaQuestion({
        authorId: user.id,
        title: 'Question 1',
      }),
      questionFactory.makePrismaQuestion({
        authorId: user.id,
        title: 'Question 2',
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      questions: [
        expect.objectContaining({
          title: 'Question 1',
        }),
        expect.objectContaining({
          title: 'Question 2',
        }),
      ],
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
