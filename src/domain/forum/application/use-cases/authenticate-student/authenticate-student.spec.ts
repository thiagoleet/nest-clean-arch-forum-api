import { AuthenticateStudentUseCase } from './authenticate-student';
import { InMemoryStudentsRepository } from 'test/repositories/forum/in-memory-students.repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeStudent } from 'test/factories/forum/make-sutdent';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { WrongCredentialsError } from '../../errors';

describe('AuthenticateStudentUseCase', () => {
  let repository: InMemoryStudentsRepository;
  let fakeHasher: FakeHasher;
  let fakeEncrypter: FakeEncrypter;
  let sut: AuthenticateStudentUseCase;

  beforeEach(() => {
    repository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateStudentUseCase(repository, fakeHasher, fakeEncrypter);
  });

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'johndoe@email.com',
      password: await fakeHasher.hash('password'),
    });

    await repository.create(student);

    const result = await sut.execute({
      email: 'johndoe@email.com',
      password: 'password',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it('should not allow authenticate unregistered student', async () => {
    const result = await sut.execute({
      email: 'johndoe@email.com',
      password: 'password',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });

  it('should not allow authenticate with wrong credentials', async () => {
    const student = makeStudent({
      email: 'johndoe@email.com',
    });

    await repository.create(student);

    const result = await sut.execute({
      email: 'johndoe@email.com',
      password: 'wrong-password',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
