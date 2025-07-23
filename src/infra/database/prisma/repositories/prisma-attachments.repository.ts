import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments.repository';
import { Injectable } from '@nestjs/common';
import { PrismaAttachmentsMapper } from '../mappers/prisma-attachments.mapper';
import { Attachment } from '@/domain/forum/enterprise/entities';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentsMapper.toPersistence(attachment);

    await this.prisma.attachment.create({
      data,
    });
  }
}
