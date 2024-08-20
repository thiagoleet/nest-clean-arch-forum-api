import { Entity, UniqueEntityID } from '@/core/entities';

interface StudentProps {
  name: string;
}

export class Student extends Entity<StudentProps> {
  static create(props: StudentProps, id?: UniqueEntityID): Student {
    const student = new Student(props, id);

    return student;
  }
}
