import { Injectable } from '@nestjs/common';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';
import { Answer } from '@/domain/forum/enterprise/entities';
import { PrismaService } from '../prisma.service';
import { PrismaAnswerMapper } from '../mappers/prisma-answer.mapper';
import { PrismaAnswerAttachmentsRepository } from './prisma-answer-attachments.repository';

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private prisma: PrismaService,
    private attachmentsRepository: PrismaAnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPersistence(answer);
    await this.prisma.answer.create({ data });

    await this.attachmentsRepository.createMany(answer.attachments.getItems());
  }

  async delete(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPersistence(answer);
    await this.prisma.answer.delete({
      where: {
        id: data.id,
      },
    });
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({ where: { id } });

    if (!answer) {
      return null;
    }

    return PrismaAnswerMapper.toDomain(answer);
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return answers.map(PrismaAnswerMapper.toDomain);
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPersistence(answer);
    await this.prisma.answer.update({
      where: {
        id: data.id,
      },
      data,
    });

    await Promise.all([
      this.prisma.question.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.attachmentsRepository.createMany(answer.attachments.getNewItems()),
      this.attachmentsRepository.deleteMany(
        answer.attachments.getRemovedItems(),
      ),
    ]);
  }
}
