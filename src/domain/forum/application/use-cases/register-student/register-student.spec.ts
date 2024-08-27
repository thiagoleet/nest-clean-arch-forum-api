import { RegisterStudentUseCase } from './register-student';
import { Student } from '@/domain/forum/enterprise/entities';
import { InMemoryStudentsRepository } from 'test/repositories/forum/in-memory-students.repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeStudent } from 'test/factories/forum/make-sutdent';
import { StudentAlreadyExistsError } from '../../errors';

describe('RegisterStudentUseCase', () => {
  let repository: InMemoryStudentsRepository;
  let fakeHasher: FakeHasher;
  let sut: RegisterStudentUseCase;

  beforeEach(() => {
    repository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterStudentUseCase(repository, fakeHasher);
  });

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'password',
    });

    const { student } = result.value as { student: Student };
    const [item] = repository.items;

    expect(result.isRight()).toBe(true);
    expect(student).toEqual(item);
  });

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'password',
    });

    const hashedPassword = await fakeHasher.hash('password');

    const [item] = repository.items;

    expect(result.isRight()).toBe(true);
    expect(item.password).toEqual(hashedPassword);
  });

  it('should return an error when student is already registered', async () => {
    const registeredStudent = makeStudent({
      email: 'johndoe@email.com',
    });

    await repository.create(registeredStudent);

    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'password',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(StudentAlreadyExistsError);
  });
});
