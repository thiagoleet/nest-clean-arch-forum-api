import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment.mapper';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { PrismaAnswerCommentWithAuthorMapper } from '../mappers/prisma-answer-comment-with-author.mapper';

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(comment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPersistence(comment);
    await this.prisma.comment.create({ data });
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const comment = await this.prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      return null;
    }

    return PrismaAnswerCommentMapper.toDomain(comment);
  }

  async delete(comment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPersistence(comment);
    await this.prisma.comment.delete({
      where: {
        id: data.id,
      },
    });
  }

  async findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { answerId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return comments.map(PrismaAnswerCommentMapper.toDomain);
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const comments = await this.prisma.comment.findMany({
      where: { answerId },
      include: { author: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return comments.map(PrismaAnswerCommentWithAuthorMapper.toDomain);
  }
}
