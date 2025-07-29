import { FetchQuestionCommentsUseCase } from './fetch-question-comments';
import { UniqueEntityID } from '@/core/entities';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/forum/in-memory-question-comments.repository';
import { makeQuestionComment } from 'test/factories/forum/make-question-comment';
import { InMemoryStudentsRepository } from 'test/repositories/forum/in-memory-students.repository';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { makeStudent } from 'test/factories/forum/make-sutdent';

describe('FetchQuestionCommentsUseCase', () => {
  let repository: InMemoryQuestionCommentsRepository;
  let studentsRepository: InMemoryStudentsRepository;
  let sut: FetchQuestionCommentsUseCase;

  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository();
    repository = new InMemoryQuestionCommentsRepository(studentsRepository);
    sut = new FetchQuestionCommentsUseCase(repository);
  });

  it('should be able fetch question comments', async () => {
    const student = makeStudent({ name: 'John Doe' });

    await studentsRepository.create(student);

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID('question-id'),
      authorId: student.id,
    });

    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID('question-id'),
      authorId: student.id,
    });

    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityID('question-id'),
      authorId: student.id,
    });

    await Promise.all([
      repository.create(comment1),
      repository.create(comment2),
      repository.create(comment3),
    ]);

    const result = await sut.execute({
      page: 1,
      questionId: 'question-id',
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

  it('should be able to fetch paginate questions comments', async () => {
    const student = makeStudent({ name: 'John Doe' });

    await studentsRepository.create(student);

    for (let i = 1; i <= 21; i++) {
      const createdAnswer = makeQuestionComment({
        questionId: new UniqueEntityID('question-id'),
        authorId: student.id,
      });

      await repository.create(createdAnswer);
    }

    const result = await sut.execute({
      questionId: 'question-id',
      page: 2,
    });

    const { comments } = result.value as { comments: CommentWithAuthor[] };

    expect(comments).toHaveLength(1);
  });
});
