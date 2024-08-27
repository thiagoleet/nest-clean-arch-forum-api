import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '@/core/entities';
import { Student, StudentProps } from '@/domain/forum/enterprise/entities';

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
