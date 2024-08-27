import { Student } from '@/domain/forum/enterprise/entities';
import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../../repositories/students.repository';
import { HashGenerator } from '../../cryptography/hash-generator';
import { StudentAlreadyExistsError } from '../../errors';

interface RegisterStudentInput {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentResponse = Either<
  StudentAlreadyExistsError,
  { student: Student }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private repository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentInput): Promise<RegisterStudentResponse> {
    const userWithSameEmail = await this.repository.findByEmail(email);

    if (userWithSameEmail) {
      return left(
        new StudentAlreadyExistsError(
          `Student with email ${email} already exists`,
        ),
      );
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const student = Student.create({ name, email, password: hashedPassword });

    await this.repository.create(student);

    return right({
      student,
    });
  }
}
