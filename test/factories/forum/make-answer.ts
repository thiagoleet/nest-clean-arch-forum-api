import { faker } from '@faker-js/faker';
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities';
import { UniqueEntityID } from '@/core/entities';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer.mapper';

export function makeAnswer(
  overide: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
) {
  const question = Answer.create(
    {
      authorId: new UniqueEntityID('author-id'),
      questionId: new UniqueEntityID('question-id'),
      content: faker.lorem.text(),
      ...overide,
    },
    id,
  );

  return question;
}

@Injectable()
export class AnswerFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
    const answer = makeAnswer(data);

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPersistence(answer),
    });

    return answer;
  }
}
