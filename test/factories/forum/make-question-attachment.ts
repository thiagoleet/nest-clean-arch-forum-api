import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities';
import { UniqueEntityID } from '@/core/entities';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

export function makeQuestionAttachment(
  overide: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const attachment = QuestionAttachment.create(
    {
      questionId: new UniqueEntityID('question-id'),
      attachmentId: new UniqueEntityID('attachment-id'),
      ...overide,
    },
    id,
  );

  return attachment;
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaAttachment(
    data: Partial<QuestionAttachmentProps> = {},
  ): Promise<QuestionAttachment> {
    const questionAttachment = makeQuestionAttachment(data);

    await this.prisma.attachment.update({
      where: {
        id: questionAttachment.attachmentId.toString(),
      },
      data: {
        questionId: questionAttachment.questionId.toString(),
      },
    });

    return questionAttachment;
  }
}
