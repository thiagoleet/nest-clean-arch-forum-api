import { FetchQuestionCommentsUseCase } from './fetch-question-comments';
import { UniqueEntityID } from '@/core/entities';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/forum/in-memory-question-comments.repository';
import { makeQuestionComment } from 'test/factories/forum/make-question-comment';
import { QuestionComment } from '@/domain/forum/enterprise/entities';

describe('FetchQuestionCommentsUseCase', () => {
  let repository: InMemoryQuestionCommentsRepository;
  let sut: FetchQuestionCommentsUseCase;

  beforeEach(() => {
    repository = new InMemoryQuestionCommentsRepository();
    sut = new FetchQuestionCommentsUseCase(repository);
  });

  it('should be able fetch question comments', async () => {
    for (let i = 1; i <= 3; i++) {
      const comment = makeQuestionComment({
        questionId: new UniqueEntityID('question-id'),
      });

      await repository.create(comment);
    }

    const result = await sut.execute({
      page: 1,
      questionId: 'question-id',
    });

    const { comments } = result.value as { comments: QuestionComment[] };

    expect(comments).toHaveLength(3);
  });

  it('should be able to fetch paginate questions comments', async () => {
    for (let i = 1; i <= 21; i++) {
      const createdAnswer = makeQuestionComment({
        questionId: new UniqueEntityID('question-id'),
      });

      await repository.create(createdAnswer);
    }

    const result = await sut.execute({
      questionId: 'question-id',
      page: 2,
    });

    const { comments } = result.value as { comments: QuestionComment[] };

    expect(comments).toHaveLength(1);
  });
});
