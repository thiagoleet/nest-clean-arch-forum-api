import { Attachment } from '@/domain/forum/enterprise/entities';
import { Prisma } from '@prisma/client';

export class PrismaAttachmentsMapper {
  static toPersistence(
    attachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    };
  }
}
