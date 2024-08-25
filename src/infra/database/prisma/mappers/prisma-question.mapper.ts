import { UniqueEntityID } from '@/core/entities';
import { Question } from '@/domain/forum/enterprise/entities';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects';
import { Question as PrismaQuestion } from '@prisma/client';

export class PrismaQUestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        title: raw.title,
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        bestAnswerId: undefined, // TODO: Implement bestAnswerId in schema
        slug: Slug.create(raw.slug),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }
}