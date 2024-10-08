import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment.mapper';

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({ where: { questionId } });
  }

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const attachments = await this.prisma.attachment.findMany({
      where: { questionId },
    });

    return attachments.map(PrismaQuestionAttachmentMapper.toDomain);
  }
}
