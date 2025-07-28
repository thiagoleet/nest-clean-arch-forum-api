import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities';
import { UniqueEntityID } from '@/core/entities';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

export function makeAnswerAttachment(
  overide: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const attachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityID('answer-id'),
      attachmentId: new UniqueEntityID('attachment-id'),
      ...overide,
    },
    id,
  );

  return attachment;
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaAttachment(
    data: Partial<AnswerAttachmentProps> = {},
  ): Promise<AnswerAttachment> {
    const answerAttachment = makeAnswerAttachment(data);

    await this.prisma.attachment.update({
      where: {
        id: answerAttachment.attachmentId.toString(),
      },
      data: {
        answerId: answerAttachment.answerId.toString(),
      },
    });

    return answerAttachment;
  }
}
