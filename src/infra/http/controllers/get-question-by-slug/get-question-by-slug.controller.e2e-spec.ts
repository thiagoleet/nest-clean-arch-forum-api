import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

describe('[E2E] GetQuestionBySlugController', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService);
    jwt = moduleRef.get<JwtService>(JwtService);

    await app.init();
  });

  test(`[GET] questions/:slug`, async () => {
    const user = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    };

    const userCreated = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: await hash(user.password, 8),
      },
    });

    const accessToken = jwt.sign({ sub: userCreated.id });

    const question = {
      title: 'Question Created',
      slug: 'question-created',
      content: 'Content',
      authorId: userCreated.id,
    };

    await prisma.question.create({
      data: question,
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
