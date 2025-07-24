import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '@/core/entities';
import {
  Attachment,
  AttachmentProps,
} from '@/domain/forum/enterprise/entities';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaAttachmentsMapper } from '@/infra/database/prisma/mappers/prisma-attachments.mapper';

export function makeAttachment(
  overide: Partial<AttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const attachment = Attachment.create(
    {
      title: faker.lorem.slug(),
      url: faker.lorem.slug(),
      ...overide,
    },
    id,
  );

  return attachment;
}

@Injectable()
export class AttachmentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaAttachment(
    data: Partial<AttachmentProps> = {},
  ): Promise<Attachment> {
    const attachment = makeAttachment(data);

    await this.prisma.attachment.create({
      data: PrismaAttachmentsMapper.toPersistence(attachment),
    });

    return attachment;
  }
}
