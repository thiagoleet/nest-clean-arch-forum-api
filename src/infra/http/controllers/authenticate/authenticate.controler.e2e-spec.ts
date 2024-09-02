import request from 'supertest';
import { hash } from 'bcryptjs';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AppModule } from '@/infra/app.module';

describe('[E2E] AuthenticateController', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService);

    await app.init();
  });

  test(`[POST] SESSION`, async () => {
    const user = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    };

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: await hash(user.password, 8),
      },
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: user.email,
      password: user.password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toMatchObject({
      accessToken: expect.any(String),
    });
  });
});
