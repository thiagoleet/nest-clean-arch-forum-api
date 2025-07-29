import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment.mapper';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { PrismaQuestionCommentWithAuthorMapper } from '../mappers/prisma-question-comment-with-author.mapper';

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(comment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPersistence(comment);
    await this.prisma.comment.create({ data });
  }

  async delete(comment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPersistence(comment);
    await this.prisma.comment.delete({
      where: {
        id: data.id,
      },
    });
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const comment = await this.prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      return null;
    }

    return PrismaQuestionCommentMapper.toDomain(comment);
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { questionId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return comments.map(PrismaQuestionCommentMapper.toDomain);
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const comments = await this.prisma.comment.findMany({
      where: { questionId },
      include: { author: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return comments.map(PrismaQuestionCommentWithAuthorMapper.toDomain);
  }
}
