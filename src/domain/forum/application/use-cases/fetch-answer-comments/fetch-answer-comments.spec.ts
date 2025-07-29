import { FetchAnswerCommentsUseCase } from './fetch-answer-comments';
import { UniqueEntityID } from '@/core/entities';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/forum/in-memory-answer-comments.repository';
import { makeAnswerComment } from 'test/factories/forum/make-answer-comment';
import { InMemoryStudentsRepository } from 'test/repositories/forum/in-memory-students.repository';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { makeStudent } from 'test/factories/forum/make-sutdent';

describe('FetchAnswerCommentsUseCase', () => {
  let repository: InMemoryAnswerCommentsRepository;
  let studentsRepository: InMemoryStudentsRepository;
  let sut: FetchAnswerCommentsUseCase;

  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository();
    repository = new InMemoryAnswerCommentsRepository(studentsRepository);
    sut = new FetchAnswerCommentsUseCase(repository);
  });

  it('should be able fetch answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' });
    await studentsRepository.create(student);

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-id'),
      authorId: student.id,
    });

    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-id'),
      authorId: student.id,
    });

    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-id'),
      authorId: student.id,
    });

    await Promise.all([
      repository.create(comment1),
      repository.create(comment2),
      repository.create(comment3),
    ]);

    const result = await sut.execute({
      page: 1,
      answerId: 'answer-id',
    });

    const { comments } = result.value as { comments: CommentWithAuthor[] };

    expect(comments).toHaveLength(3);
    expect(comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          commentId: comment1.id,
          content: comment1.content,
          author: 'John Doe',
        }),
        expect.objectContaining({
          commentId: comment2.id,
          content: comment2.content,
          author: 'John Doe',
        }),
        expect.objectContaining({
          commentId: comment3.id,
          content: comment3.content,
          author: 'John Doe',
        }),
      ]),
    );
  });

  it('should be able to fetch paginate answers comments', async () => {
    const student = makeStudent({ name: 'John Doe' });
    await studentsRepository.create(student);

    for (let i = 1; i <= 21; i++) {
      const createdAnswer = makeAnswerComment({
        answerId: new UniqueEntityID('answer-id'),
        authorId: student.id,
      });

      await repository.create(createdAnswer);
    }

    const result = await sut.execute({
      answerId: 'answer-id',
      page: 2,
    });

    const { comments } = result.value as { comments: CommentWithAuthor[] };

    expect(comments).toHaveLength(1);
  });
});
