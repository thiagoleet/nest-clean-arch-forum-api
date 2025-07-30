import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { JwtService } from '@nestjs/jwt';
import { StudentFactory } from 'test/factories/forum/make-sutdent';
import { DatabaseModule } from '@/infra/database/database.module';
import { QuestionFactory } from 'test/factories/forum/make-question';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects';
import { AttachmentFactory } from 'test/factories/forum/make-attachment';
import { QuestionAttachmentFactory } from 'test/factories/forum/make-question-attachment';

describe('[E2E] GetQuestionBySlugController', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get<StudentFactory>(StudentFactory);
    questionFactory = moduleRef.get<QuestionFactory>(QuestionFactory);
    attachmentFactory = moduleRef.get<AttachmentFactory>(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get<QuestionAttachmentFactory>(
      QuestionAttachmentFactory,
    );
    jwt = moduleRef.get<JwtService>(JwtService);

    await app.init();
  });

  test(`[GET] questions/:slug`, async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      slug: Slug.create('question-created'),
      title: 'Question Created',
    });

    const attachment = await attachmentFactory.makePrismaAttachment({
      title: 'Attachment Title',
      url: 'https://example.com/attachment.jpg',
    });

    await questionAttachmentFactory.makePrismaAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    });

    const response = await request(app.getHttpServer())
      .get('/questions/question-created')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      question: expect.objectContaining({
        title: 'Question Created',
        authorName: 'John Doe',
        attachments: [
          expect.objectContaining({
            title: 'Attachment Title',
          }),
        ],
      }),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
