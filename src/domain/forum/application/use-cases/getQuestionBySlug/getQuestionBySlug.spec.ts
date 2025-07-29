import { InMemoryQuestionsRepository } from 'test/repositories/forum/in-memory-questions.repository';
import { GetQuestionBySlugUseCase } from './getQuestionBySlug';
import { makeQuestion } from 'test/factories/forum/make-question';
import { ResourceNotFoundError } from '@/core/errors';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/forum/in-memory-question-attachments.repository';
import { InMemoryAttachmentssRepository } from 'test/repositories/forum/in-memory-attachments.repository';
import { InMemoryStudentsRepository } from 'test/repositories/forum/in-memory-students.repository';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { makeStudent } from 'test/factories/forum/make-sutdent';
import { makeAttachment } from 'test/factories/forum/make-attachment';
import { makeQuestionAttachment } from 'test/factories/forum/make-question-attachment';

describe('GetQuestionBySlugUseCase', () => {
  let repository: InMemoryQuestionsRepository;
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
  let attachmentRespository: InMemoryAttachmentssRepository;
  let studentsRepository: InMemoryStudentsRepository;
  let sut: GetQuestionBySlugUseCase;

  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    attachmentRespository = new InMemoryAttachmentssRepository();
    studentsRepository = new InMemoryStudentsRepository();

    repository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentRespository,
      studentsRepository,
    );
    sut = new GetQuestionBySlugUseCase(repository);
  });

  it('should be able to get a question by slug', async () => {
    const author = makeStudent({
      name: 'John Doe',
    });

    await studentsRepository.create(author);

    const createQuestion = makeQuestion({
      title: 'New Question',
      authorId: author.id,
    });

    await repository.create(createQuestion);

    const attachment = makeAttachment({
      title: 'Attachment 1',
    });

    await attachmentRespository.create(attachment);

    const questionAttachment = makeQuestionAttachment({
      attachmentId: attachment.id,
      questionId: createQuestion.id,
    });

    await questionAttachmentsRepository.create(questionAttachment);

    const { value } = await sut.execute({
      slug: 'new-question',
    });

    const { question } = value as { question: QuestionDetails };

    expect(question.slug.value).toBe('new-question');
    expect(value).toMatchObject({
      question: expect.objectContaining({
        questionId: createQuestion.id,
        authorId: author.id,
        authorName: author.name,
        title: createQuestion.title,
        slug: createQuestion.slug,
        content: createQuestion.content,
        attachments: expect.arrayContaining([
          expect.objectContaining({
            id: attachment.id,
            title: attachment.title,
            url: attachment.url,
          }),
        ]),
        bestAnswerId: createQuestion.bestAnswerId,
        createdAt: createQuestion.createdAt,
        updatedAt: createQuestion.updatedAt,
      }),
    });
  });

  it('should not be able to get a question by slug', async () => {
    const result = await sut.execute({
      slug: 'new-question',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
