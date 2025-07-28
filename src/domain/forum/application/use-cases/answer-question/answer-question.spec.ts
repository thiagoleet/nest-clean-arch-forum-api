import { InMemoryAnswersRepository } from 'test/repositories/forum/in-memory-answers.repository';
import { AnswerQuestionUseCase } from '.';
import { Answer } from '@/domain/forum/enterprise/entities';
import { UniqueEntityID } from '@/core/entities';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/forum/in-memory-answer-attachments.repository';

describe('AnswerQuestionUseCase', () => {
  let repository: InMemoryAnswersRepository;
  let attachmentsRepository: InMemoryAnswerAttachmentsRepository;

  let sut: AnswerQuestionUseCase;

  beforeEach(() => {
    attachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    repository = new InMemoryAnswersRepository(attachmentsRepository);
    sut = new AnswerQuestionUseCase(repository);
  });

  test('create an answer question', async () => {
    const result = await sut.execute({
      questionId: 'question-id',
      authorId: 'author-id',
      content: 'New Answer',
      attachmentIds: ['attachment-id-1', 'attachment-id-2'],
    });

    const { answer } = result.value as { answer: Answer };
    const [item] = repository.items;

    expect(answer.content).toBe('New Answer');
    expect(item.id).toEqual(answer.id);
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

  it('should persist attachment when creating a new answer', async () => {
    const { value } = await sut.execute({
      questionId: 'question-id',
      authorId: 'instructor-id',
      content: 'Content',
      attachmentIds: ['attachment-id-1', 'attachment-id-2'],
    });

    const { answer } = value as { answer: Answer };

    expect(answer.id).toBeTruthy();
    expect(attachmentsRepository.items).toHaveLength(2);
    expect(attachmentsRepository.items).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-id-1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-id-2'),
      }),
    ]);
  });
});
