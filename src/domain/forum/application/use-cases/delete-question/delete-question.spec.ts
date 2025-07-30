import { InMemoryQuestionsRepository } from 'test/repositories/forum/in-memory-questions.repository';
import { DeleteQuestionUseCase } from './delete-question';
import { makeQuestion } from 'test/factories/forum/make-question';
import { UniqueEntityID } from '@/core/entities';
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/forum/in-memory-question-attachments.repository';
import { makeQuestionAttachment } from 'test/factories/forum/make-question-attachment';
import { InMemoryStudentsRepository } from 'test/repositories/forum/in-memory-students.repository';
import { InMemoryAttachmentssRepository } from 'test/repositories/forum/in-memory-attachments.repository';
import { makeStudent } from 'test/factories/forum/make-sutdent';
import { makeAttachment } from 'test/factories/forum/make-attachment';

describe('DeleteQuestionUseCase', () => {
  let repository: InMemoryQuestionsRepository;
  let attachmentsRepository: InMemoryAttachmentssRepository;
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
  let studentsRepository: InMemoryStudentsRepository;
  let sut: DeleteQuestionUseCase;

  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmentssRepository();
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    studentsRepository = new InMemoryStudentsRepository();
    repository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    );

    sut = new DeleteQuestionUseCase(repository);
  });

  it('should be able to delete a question', async () => {
    const student = makeStudent({
      name: 'John Doe',
    });
    await studentsRepository.create(student);

    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    });
    await repository.create(newQuestion);

    const attachment1 = makeAttachment({
      title: 'Attachment 1',
    });
    const attachment2 = makeAttachment({
      title: 'Attachment 2',
    });
    const attachment3 = makeAttachment({
      title: 'Attachment 3',
    });

    await Promise.all([
      attachmentsRepository.create(attachment1),
      attachmentsRepository.create(attachment2),
      attachmentsRepository.create(attachment3),
    ]);

    const questionAttachment1 = makeQuestionAttachment({
      attachmentId: attachment1.id,
      questionId: newQuestion.id,
    });
    const questionAttachment2 = makeQuestionAttachment({
      attachmentId: attachment2.id,
      questionId: newQuestion.id,
    });
    const questionAttachment3 = makeQuestionAttachment({
      attachmentId: attachment3.id,
      questionId: newQuestion.id,
    });

    await Promise.all([
      questionAttachmentsRepository.create(questionAttachment1),
      questionAttachmentsRepository.create(questionAttachment2),
      questionAttachmentsRepository.create(questionAttachment3),
    ]);

    await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'author-1',
    });

    expect(repository.items).toHaveLength(0);
    expect(questionAttachmentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a question if not found', async () => {
    const result = await sut.execute({
      questionId: 'invalid-id',
      authorId: 'author-1',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not allow to delete a question if the authorId is different', async () => {
    const createQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    });
    await repository.create(createQuestion);

    const result = await sut.execute({
      questionId: createQuestion.id.toString(),
      authorId: 'wrong-author-id',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
