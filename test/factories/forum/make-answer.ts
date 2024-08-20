import { faker } from "@faker-js/faker";
import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities";
import { UniqueEntityID } from "@/core/entities";

export function makeAnswer(
  overide: Partial<AnswerProps> = {},
  id?: UniqueEntityID
) {
  const question = Answer.create(
    {
      authorId: new UniqueEntityID("author-id"),
      questionId: new UniqueEntityID("question-id"),
      content: faker.lorem.text(),
      ...overide,
    },
    id
  );

  return question;
}
