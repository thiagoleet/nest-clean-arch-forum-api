import request from 'supertest';
import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { StudentFactory } from 'test/factories/forum/make-sutdent';
import { DatabaseModule } from '@/infra/database/database.module';

describe('[E2E] UploadAttachmentController', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get<JwtService>(JwtService);
    studentFactory = moduleRef.get<StudentFactory>(StudentFactory);

    await app.init();
  });

  test(`[POST] /attachments`, async () => {
    const user = await studentFactory.makePrismaStudent();
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-upload.png');

    expect(response.statusCode).toBe(201);
  });
});
