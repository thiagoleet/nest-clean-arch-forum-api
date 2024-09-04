import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { JwtService } from '@nestjs/jwt';
import { StudentFactory } from 'test/factories/forum/make-sutdent';
import { DatabaseModule } from '@/infra/database/database.module';
import { QuestionFactory } from 'test/factories/forum/make-question';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects';

describe('[E2E] GetQuestionBySlugController', () => {
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
    studentFactory = moduleRef.get<StudentFactory>(StudentFactory);
    questionFactory = moduleRef.get<QuestionFactory>(QuestionFactory);
    jwt = moduleRef.get<JwtService>(JwtService);

    await app.init();
  });

  test(`[GET] questions/:slug`, async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    await questionFactory.makePrismaQuestion({
      authorId: user.id,
      slug: Slug.create('question-created'),
      title: 'Question Created',
    });

    const response = await request(app.getHttpServer())
      .get('/questions/question-created')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      question: expect.objectContaining({
        title: 'Question Created',
      }),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
