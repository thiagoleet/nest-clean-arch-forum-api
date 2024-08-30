import { UniqueEntityID } from '@/core/entities';
import { QuestionComment } from '@/domain/forum/enterprise/entities';
import { Comment as PrismaComment, Prisma } from '@prisma/client';

export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaComment): QuestionComment {
    if (!raw.questionId) {
      throw new Error('QuestionId is required to create QuestionComment');
    }

    return QuestionComment.create(
      {
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        questionId: new UniqueEntityID(raw.questionId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(
    comment: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      questionId: comment.questionId.toString(),
      authorId: comment.authorId.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
