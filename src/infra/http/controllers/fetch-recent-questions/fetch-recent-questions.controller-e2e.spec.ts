import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

describe('[E2E] FetchRecentQuestionsController', () => {
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

  test(`/GET questions`, async () => {
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

    const questions: {
      title: string;
      slug: string;
      content: string;
      authorId: string;
    }[] = [];

    for (let i = 1; i <= 3; i++) {
      questions.push({
        title: `Question ${i}`,
        slug: `question-${i}`,
        content: `Content ${i}`,
        authorId: userCreated.id,
      });
    }

    await prisma.question.createMany({
      data: questions,
    });

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
        expect.objectContaining({
          title: 'Question 3',
        }),
      ],
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
