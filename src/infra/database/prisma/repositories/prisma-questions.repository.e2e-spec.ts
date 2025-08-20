import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { StudentFactory } from 'test/factories/forum/make-sutdent';
import { DatabaseModule } from '@/infra/database/database.module';
import { QuestionFactory } from 'test/factories/forum/make-question';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects';
import { AttachmentFactory } from 'test/factories/forum/make-attachment';
import { QuestionAttachmentFactory } from 'test/factories/forum/make-question-attachment';
import { CacheRepository } from '@/infra/cache/cache-repository';
import { CacheModule } from '@/infra/cache/cache.module';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';

describe('[E2E] PrismaQuestionsRepository', () => {
  let app: INestApplication;

  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let questionsRepository: QuestionsRepository;
  let cacheRepository: CacheRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
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
    questionsRepository =
      moduleRef.get<QuestionsRepository>(QuestionsRepository);
    cacheRepository = moduleRef.get<CacheRepository>(CacheRepository);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should cache question details', async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      slug: Slug.create('question-created'),
      title: 'Question Created',
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    });

    const slug = question.slug.value;

    const questionDetails = await questionsRepository.findDetailsBySlug(slug);
    const cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).toEqual(JSON.stringify(questionDetails));
  });

  it('should return cached question details on subsequent calls', async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      slug: Slug.create('cached-question-created'),
      title: 'Question Created',
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    });

    const slug = question.slug.value;
    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    );

    const questionDetails = await questionsRepository.findDetailsBySlug(slug);

    expect(questionDetails).toEqual({ empty: true });
  });

  it('should reset question details when saving the question', async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      slug: Slug.create('cached-question-invalidated'),
      title: 'Question Created',
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    });

    const slug = question.slug.value;

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    );

    await questionsRepository.save(question);

    const questionDetails = await questionsRepository.findDetailsBySlug(slug);
    const cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).toEqual(JSON.stringify(questionDetails));
  });
});
