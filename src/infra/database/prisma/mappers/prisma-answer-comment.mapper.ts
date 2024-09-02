import { UniqueEntityID } from '@/core/entities';
import { AnswerComment } from '@/domain/forum/enterprise/entities';
import { Comment as PrismaComment, Prisma } from '@prisma/client';

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaComment): AnswerComment {
    if (!raw.answerId) {
      throw new Error('AnswerId is required to create AnswerComment');
    }

    return AnswerComment.create(
      {
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        answerId: new UniqueEntityID(raw.answerId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(
    comment: AnswerComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      answerId: comment.answerId.toString(),
      authorId: comment.authorId.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
