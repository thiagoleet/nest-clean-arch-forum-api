import { faker } from "@faker-js/faker";
import {
  AnswerComment,
  AnswerCommentProps,
} from "@/domain/forum/enterprise/entities";
import { UniqueEntityID } from "@/core/entities";

export function makeAnswerComment(
  overide: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID
) {
  const comment = AnswerComment.create(
    {
      authorId: new UniqueEntityID("author-id"),
      answerId: new UniqueEntityID("answer-id"),
      content: faker.lorem.text(),
      ...overide,
    },
    id
  );

  return comment;
}
