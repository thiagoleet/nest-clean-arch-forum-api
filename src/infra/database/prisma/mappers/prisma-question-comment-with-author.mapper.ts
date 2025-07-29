import { Comment as PrismaComment, User as PrismaUser } from '@prisma/client';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { UniqueEntityID } from '@/core/entities';

type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser;
};

export class PrismaQuestionCommentWithAuthorMapper {
  static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: new UniqueEntityID(raw.id),
      content: raw.content,
      authorId: new UniqueEntityID(raw.authorId),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      author: raw.author.name,
    });
  }
}
