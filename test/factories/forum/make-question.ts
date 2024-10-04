import { faker } from '@faker-js/faker';
import { Question, QuestionProps } from '@/domain/forum/enterprise/entities';
import { UniqueEntityID } from '@/core/entities';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question.mapper';

export function makeQuestion(
  overide: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
) {
  const question = Question.create(
    {
      authorId: new UniqueEntityID('author-id'),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...overide,
    },
    id,
  );

  return question;
}

@Injectable()
export class QuestionFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaQuestion(
    data: Partial<QuestionProps> = {},
  ): Promise<Question> {
    const question = makeQuestion(data);

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPersistence(question),
    });

    return question;
  }
}
