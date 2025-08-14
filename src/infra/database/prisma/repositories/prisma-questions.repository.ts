import { Injectable } from '@nestjs/common';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import { Question } from '@/domain/forum/enterprise/entities';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionMapper } from '../mappers/prisma-question.mapper';
import { PrismaQuestionAttachmentsRepository } from './prisma-question-attachments.repository';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details.mapper';
import { DomainEvents } from '@/core/events';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private attachmentsRepository: PrismaQuestionAttachmentsRepository,
  ) {}

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistence(question);
    await this.prisma.question.create({ data });

    await this.attachmentsRepository.createMany(
      question.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistence(question);
    await this.prisma.question.delete({
      where: {
        id: data.id,
      },
    });
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({ where: { id } });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({ where: { slug } });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = await this.prisma.question.findUnique({
      where: { slug },
      include: {
        author: true,
        attachments: true,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionDetailsMapper.toDomain(question);
  }

  async findManyRecent(params: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return questions.map(PrismaQuestionMapper.toDomain);
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistence(question);

    await Promise.all([
      this.prisma.question.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.attachmentsRepository.createMany(question.attachments.getNewItems()),
      this.attachmentsRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),
    ]);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }
}
