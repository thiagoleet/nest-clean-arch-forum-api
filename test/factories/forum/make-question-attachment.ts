import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from "@/domain/forum/enterprise/entities";
import { UniqueEntityID } from "@/core/entities";

export function makeQuestionAttachment(
  overide: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityID
) {
  const attachment = QuestionAttachment.create(
    {
      questionId: new UniqueEntityID("question-id"),
      attachmentId: new UniqueEntityID("attachment-id"),
      ...overide,
    },
    id
  );

  return attachment;
}
