import { Entity, UniqueEntityID } from '@/core/entities';

interface InstructorProps {
  name: string;
}

export class Instructor extends Entity<InstructorProps> {
  static create(props: InstructorProps, id?: UniqueEntityID): Instructor {
    const instructor = new Instructor(props, id);

    return instructor;
  }
}
