import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { JwtService } from '@nestjs/jwt';
import { StudentFactory } from 'test/factories/forum/make-sutdent';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AttachmentFactory } from 'test/factories/forum/make-attachment';

describe('[E2E] CreateQuestionController', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let attachmentFactory: AttachmentFactory;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AttachmentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get<JwtService>(JwtService);
    studentFactory = moduleRef.get<StudentFactory>(StudentFactory);
    attachmentFactory = moduleRef.get<AttachmentFactory>(AttachmentFactory);
    prisma = moduleRef.get<PrismaService>(PrismaService);

    await app.init();
  });

  test(`[POST] questions`, async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const attachment1 = await attachmentFactory.makePrismaAttachment();
    const attachment2 = await attachmentFactory.makePrismaAttachment();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New Question',
        content: 'Question Content',
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
      });

    expect(response.statusCode).toBe(201);

    const questionOnDatabase = await prisma.question.findFirst({
      where: { title: 'New Question' },
    });

    expect(questionOnDatabase).toBeTruthy();

    expect(questionOnDatabase).toBeTruthy();

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: questionOnDatabase?.id,
      },
    });

    expect(attachmentsOnDatabase).toHaveLength(2);
  });

  afterEach(async () => {
    await app.close();
  });
});
