import { faker } from "@faker-js/faker";
import {
  QuestionComment,
  QuestionCommentProps,
} from "@/domain/forum/enterprise/entities";
import { UniqueEntityID } from "@/core/entities";

export function makeQuestionComment(
  overide: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID
) {
  const comment = QuestionComment.create(
    {
      authorId: new UniqueEntityID("author-id"),
      questionId: new UniqueEntityID("question-id"),
      content: faker.lorem.text(),
      ...overide,
    },
    id
  );

  return comment;
}
