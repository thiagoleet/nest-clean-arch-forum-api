import { faker } from '@faker-js/faker';
import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities';
import { UniqueEntityID } from '@/core/entities';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/prisma-question-comment.mapper';

export function makeQuestionComment(
  overide: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID,
) {
  const comment = QuestionComment.create(
    {
      authorId: new UniqueEntityID('author-id'),
      questionId: new UniqueEntityID('question-id'),
      content: faker.lorem.text(),
      ...overide,
    },
    id,
  );

  return comment;
}

@Injectable()
export class QuestionCommentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaQuestionComment(
    data: Partial<QuestionCommentProps> = {},
  ): Promise<QuestionComment> {
    const comment = makeQuestionComment(data);

    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPersistence(comment),
    });

    return comment;
  }
}
