import { InMemoryQuestionsRepository } from 'test/repositories/forum/in-memory-questions.repository';
import { CreateQuestionUseCase } from './create-question';
import { Question } from '@/domain/forum/enterprise/entities';
import { UniqueEntityID } from '@/core/entities';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/forum/in-memory-question-attachments.repository';
import { InMemoryStudentsRepository } from 'test/repositories/forum/in-memory-students.repository';
import { InMemoryAttachmentssRepository } from 'test/repositories/forum/in-memory-attachments.repository';

describe('CreateQuestionUseCase', () => {
  let repository: InMemoryQuestionsRepository;
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
  let attachmentRepository: InMemoryAttachmentssRepository;
  let studentsRepository: InMemoryStudentsRepository;
  let sut: CreateQuestionUseCase;

  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository();
    attachmentRepository = new InMemoryAttachmentssRepository();
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    repository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentRepository,
      studentsRepository,
    );
    sut = new CreateQuestionUseCase(repository);
  });

  it('should be able to create an answer question', async () => {
    const { value } = await sut.execute({
      authorId: 'instructor-id',
      title: 'New Question',
      content: 'Content',
      attachmentIds: ['attachment-id-1', 'attachment-id-2'],
    });

    const { question } = value as { question: Question };
    const [item] = repository.items;

    expect(question.id).toBeTruthy();
    expect(item.id).toEqual(question.id);
    expect(item.attachments.currentItems).toHaveLength(2);
    expect(item.attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-id-1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-id-2'),
      }),
    ]);
  });

  it('should persist attachment when creating a question', async () => {
    const { value } = await sut.execute({
      authorId: 'instructor-id',
      title: 'New Question',
      content: 'Content',
      attachmentIds: ['attachment-id-1', 'attachment-id-2'],
    });

    const { question } = value as { question: Question };

    expect(question.id).toBeTruthy();
    expect(questionAttachmentsRepository.items).toHaveLength(2);
    expect(questionAttachmentsRepository.items).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-id-1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-id-2'),
      }),
    ]);
  });
});
