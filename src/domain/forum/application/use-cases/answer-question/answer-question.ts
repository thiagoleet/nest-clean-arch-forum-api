import { Either, right } from "@/core/either";
import {
  Answer,
  AnswerAttachment,
  AnswerAttachmentList,
} from "@/domain/forum/enterprise/entities";
import { UniqueEntityID } from "@/core/entities";
import { AnswersRepository } from "../../repositories/answers.repository";

interface AnswerQuestionInput {
  authorId: string;
  questionId: string;
  content: string;
  attachmentIds: string[];
}

type AnswerQuestionResponse = Either<null, { answer: Answer }>;

export class AnswerQuestionUseCase {
  constructor(private repository: AnswersRepository) {}

  async execute({
    authorId,
    questionId,
    content,
    attachmentIds,
  }: AnswerQuestionInput): Promise<AnswerQuestionResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
    });

    const attachments = attachmentIds.map((attachmentId) =>
      AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      })
    );

    answer.attachments = new AnswerAttachmentList(attachments);

    await this.repository.create(answer);

    return right({ answer });
  }
}
