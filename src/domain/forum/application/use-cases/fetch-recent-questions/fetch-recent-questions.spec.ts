import { InMemoryQuestionsRepository } from 'test/repositories/forum/in-memory-questions.repository';
import { makeQuestion } from 'test/factories/forum/make-question';
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions';
import { Question } from '@/domain/forum/enterprise/entities';
import { InMemoryAttachmentssRepository } from 'test/repositories/forum/in-memory-attachments.repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/forum/in-memory-question-attachments.repository';
import { InMemoryStudentsRepository } from 'test/repositories/forum/in-memory-students.repository';

describe('FetchRecentQuestionsUseCase', () => {
  let repository: InMemoryQuestionsRepository;
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
  let attachmentRespository: InMemoryAttachmentssRepository;
  let studentsRepository: InMemoryStudentsRepository;
  let sut: FetchRecentQuestionsUseCase;

  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    attachmentRespository = new InMemoryAttachmentssRepository();
    studentsRepository = new InMemoryStudentsRepository();
    repository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentRespository,
      studentsRepository,
    );
    sut = new FetchRecentQuestionsUseCase(repository);
  });

  it('should be able to fetch recent questions', async () => {
    for (let i = 1; i <= 3; i++) {
      const createQuestion = makeQuestion({
        createdAt: new Date(`2024-07-${i.toString().padStart(2, '0')}`),
      });

      await repository.create(createQuestion);
    }

    const result = await sut.execute({
      page: 1,
    });

    const { questions } = result.value as { questions: Question[] };

    expect(questions).toHaveLength(3);
    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date('2024-07-03') }),
      expect.objectContaining({ createdAt: new Date('2024-07-02') }),
      expect.objectContaining({ createdAt: new Date('2024-07-01') }),
    ]);
  });

  it('should be able to fetch paginate recent questions', async () => {
    for (let i = 1; i <= 21; i++) {
      const createQuestion = makeQuestion();

      await repository.create(createQuestion);
    }

    const result = await sut.execute({
      page: 2,
    });

    const { questions } = result.value as { questions: Question[] };

    expect(questions).toHaveLength(1);
  });
});
