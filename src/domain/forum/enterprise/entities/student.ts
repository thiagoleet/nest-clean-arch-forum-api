import { Entity } from "@/core/entities";
import { UniqueEntityID } from "./value-objects";

interface StudentProps {
  name: string;
}

export class Student extends Entity<StudentProps> {
  static create(props: StudentProps, id?: UniqueEntityID): Student {
    const student = new Student(props, id);

    return student;
  }
}
