import { Student } from '../../enterprise/entities';

export abstract class StudentsRepository {
  abstract create(question: Student): Promise<void>;
  abstract findByEmail(email: string): Promise<Student | null>;
}
