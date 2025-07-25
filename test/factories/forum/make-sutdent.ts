import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '@/core/entities';
import { Student, StudentProps } from '@/domain/forum/enterprise/entities';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-student.mapper';

export function makeStudent(
  overide: Partial<StudentProps> = {},
  id?: UniqueEntityID,
) {
  const student = Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...overide,
    },
    id,
  );

  return student;
}

@Injectable()
export class StudentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
    const student = makeStudent(data);

    await this.prisma.user.create({
      data: PrismaStudentMapper.toPersistence(student),
    });

    return student;
  }
}
