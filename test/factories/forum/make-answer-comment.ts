import { faker } from '@faker-js/faker';
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities';
import { UniqueEntityID } from '@/core/entities';
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export function makeAnswerComment(
  overide: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID,
) {
  const comment = AnswerComment.create(
    {
      authorId: new UniqueEntityID('author-id'),
      answerId: new UniqueEntityID('answer-id'),
      content: faker.lorem.text(),
      ...overide,
    },
    id,
  );

  return comment;
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaAnswer(
    data: Partial<AnswerCommentProps> = {},
  ): Promise<AnswerComment> {
    const comment = makeAnswerComment(data);

    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPersistence(comment),
    });

    return comment;
  }
}
