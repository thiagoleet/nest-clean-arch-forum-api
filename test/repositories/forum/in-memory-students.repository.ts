import { StudentsRepository } from '@/domain/forum/application/repositories/students.repository';
import { Student } from '@/domain/forum/enterprise/entities';

export class InMemoryStudentsRepository implements StudentsRepository {
  private _items: Student[];

  get items() {
    return this._items;
  }

  constructor() {
    this._items = [];
  }

  async create(student: Student): Promise<void> {
    this._items.push(student);
  }

  async findByEmail(email: string): Promise<Student | null> {
    return this._items.find((student) => student.email === email) || null;
  }
}
