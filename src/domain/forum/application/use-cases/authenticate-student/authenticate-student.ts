import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../../repositories/students.repository';
import { WrongCredentialsError } from '../../errors';
import { HashComparer } from '../../cryptography/hash-comparer';
import { Encrypter } from '../../cryptography/encrypter';

interface AuthenticateStudentInput {
  email: string;
  password: string;
}

type AuthenticateStudentResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>;

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private repository: StudentsRepository,
    private hashCompare: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentInput): Promise<AuthenticateStudentResponse> {
    const student = await this.repository.findByEmail(email);

    if (!student) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashCompare.compare(
      password,
      student.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    });

    return right({ accessToken });
  }
}
