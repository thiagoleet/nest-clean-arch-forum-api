import { InMemoryQuestionsRepository } from 'test/repositories/forum/in-memory-questions.repository';
import { EditQuestionUseCase } from './edit-question';
import { makeQuestion } from 'test/factories/forum/make-question';
import { UniqueEntityID } from '@/core/entities';
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/forum/in-memory-question-attachments.repository';
import { makeQuestionAttachment } from 'test/factories/forum/make-question-attachment';
import { InMemoryAttachmentssRepository } from 'test/repositories/forum/in-memory-attachments.repository';
import { InMemoryStudentsRepository } from 'test/repositories/forum/in-memory-students.repository';
import { makeStudent } from 'test/factories/forum/make-sutdent';
import { makeAttachment } from 'test/factories/forum/make-attachment';

describe('EditQuestionUseCase', () => {
  let repository: InMemoryQuestionsRepository;
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
  let attachmentRespository: InMemoryAttachmentssRepository;
  let studentsRepository: InMemoryStudentsRepository;
  let sut: EditQuestionUseCase;

  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    attachmentRespository = new InMemoryAttachmentssRepository();
    studentsRepository = new InMemoryStudentsRepository();
    repository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentRespository,
      studentsRepository,
    );
    sut = new EditQuestionUseCase(repository, questionAttachmentsRepository);
  });

  it('should be able to edit a question', async () => {
    const student = makeStudent({
      name: 'John Doe',
    });
    await studentsRepository.create(student);

    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
      title: 'Old Title',
      content: 'Old Content',
    });
    await repository.create(newQuestion);

    const attachment = makeAttachment({
      title: 'Attachment 1',
    });

    await attachmentRespository.create(attachment);

    const questionAttachment = makeQuestionAttachment({
      attachmentId: attachment.id,
      questionId: newQuestion.id,
    });

    await questionAttachmentsRepository.create(questionAttachment);

    // Act
    await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'author-1',
      title: 'New Title',
      content: 'New Content',
      attachmentIds: [attachment.id.toString()],
    });

    // Assert
    const [item] = repository.items;

    expect(item).toMatchObject({
      title: 'New Title',
      content: 'New Content',
    });

    expect(item.attachments.currentItems).toHaveLength(1);
    expect(item.attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: attachment.id,
      }),
    ]);
  });

  it('should not be able to edit a question if not found', async () => {
    const result = await sut.execute({
      questionId: 'invalid-id',
      authorId: 'author-1',
      title: 'New Title',
      content: 'New Content',
      attachmentIds: [],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not allow to edit a question if the authorId is different', async () => {
    const createQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    });
    await repository.create(createQuestion);

    const result = await sut.execute({
      questionId: createQuestion.id.toString(),
      authorId: 'wrong-author-id',
      title: 'New Title',
      content: 'New Content',
      attachmentIds: [],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should sync new and removed attachments when editing a question', async () => {
    const student = makeStudent({
      name: 'John Doe',
    });
    await studentsRepository.create(student);

    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
      title: 'Old Title',
      content: 'Old Content',
    });
    await repository.create(newQuestion);

    const attachment1 = makeAttachment({
      title: 'Attachment 1',
    });
    const attachment2 = makeAttachment({
      title: 'Attachment 2',
    });

    await Promise.all([
      attachmentRespository.create(attachment1),
      attachmentRespository.create(attachment2),
    ]);

    const questionAttachment1 = makeQuestionAttachment({
      attachmentId: attachment1.id,
      questionId: newQuestion.id,
    });
    const questionAttachment2 = makeQuestionAttachment({
      attachmentId: attachment2.id,
      questionId: newQuestion.id,
    });

    await Promise.all([
      questionAttachmentsRepository.create(questionAttachment1),
      questionAttachmentsRepository.create(questionAttachment2),
    ]);

    const attachment3 = makeAttachment({
      title: 'Attachment 3',
    });
    await attachmentRespository.create(attachment3);

    const questionAttachment3 = makeQuestionAttachment({
      attachmentId: attachment3.id,
      questionId: newQuestion.id,
    });

    await questionAttachmentsRepository.create(questionAttachment3);

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'author-1',
      title: 'New Title',
      content: 'New Content',
      attachmentIds: [attachment1.id.toString(), attachment3.id.toString()],
    });

    expect(result.isRight()).toBeTruthy();

    const [item] = repository.items;

    expect(item.attachments.currentItems).toHaveLength(2);
    expect(item.attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: attachment1.id,
      }),
      expect.objectContaining({
        attachmentId: attachment3.id,
      }),
    ]);
  });
});
