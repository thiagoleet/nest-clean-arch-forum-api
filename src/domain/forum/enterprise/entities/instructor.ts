import { Entity } from "@/core/entities";
import { UniqueEntityID } from "./value-objects";

interface InstructorProps {
  name: string;
}

export class Instructor extends Entity<InstructorProps> {
  static create(props: InstructorProps, id?: UniqueEntityID): Instructor {
    const instructor = new Instructor(props, id);

    return instructor;
  }
}
