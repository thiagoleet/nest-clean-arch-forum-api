import { DeleteAnswerCommentUseCase } from './delete-answer-comment';
import { UniqueEntityID } from '@/core/entities';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/forum/in-memory-answer-comments.repository';
import { makeAnswerComment } from 'test/factories/forum/make-answer-comment';
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors';
import { InMemoryStudentsRepository } from 'test/repositories/forum/in-memory-students.repository';

describe('DeleteAnswerCommentUseCase', () => {
  let repository: InMemoryAnswerCommentsRepository;
  let studentsRepository: InMemoryStudentsRepository;
  let sut: DeleteAnswerCommentUseCase;

  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository();
    repository = new InMemoryAnswerCommentsRepository(studentsRepository);
    sut = new DeleteAnswerCommentUseCase(repository);
  });

  it('should be able to delete a comment on a answer', async () => {
    const comment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('comment-id'),
    );
    repository.items.push(comment);

    await sut.execute({
      authorId: 'author-id',
      answerCommentId: 'comment-id',
    });

    expect(repository.items).toHaveLength(0);
  });

  it('should not be able to delete a comment on a answer if it not exists/matches', async () => {
    const result = await sut.execute({
      authorId: 'author-id',
      answerCommentId: 'answer-id',
    });
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete another user answer comment', async () => {
    const comment = makeAnswerComment(
      { authorId: new UniqueEntityID('author-id') },
      new UniqueEntityID('comment-id'),
    );
    repository.items.push(comment);

    const result = await sut.execute({
      authorId: 'wrong-author-id',
      answerCommentId: 'comment-id',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
