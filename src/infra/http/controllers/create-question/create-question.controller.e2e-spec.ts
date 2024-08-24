import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

describe('[E2E] CreateQuestionController', () => {
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

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New Question',
        content: 'Question Content',
      });

    expect(response.statusCode).toBe(201);

    const questionOnDatabase = await prisma.question.findFirst({
      where: { title: 'New Question' },
    });

    expect(questionOnDatabase).toBeTruthy();
  });

  afterAll(async () => {
    await app.close();
  });
});
