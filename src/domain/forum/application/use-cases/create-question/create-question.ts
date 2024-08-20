import {
  Question,
  QuestionAttachment,
  QuestionAttachmentList,
} from "@/domain/forum/enterprise/entities";
import { QuestionsRepository } from "../../repositories/questions.repository";
import { UniqueEntityID } from "@/core/entities";
import { Either, right } from "@/core/either";

interface CreateQuestionInput {
  authorId: string;
  title: string;
  content: string;
  attachmentIds: string[];
}

type CreateQuestionResponse = Either<null, { question: Question }>;

export class CreateQuestionUseCase {
  constructor(private repository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content,
    attachmentIds,
  }: CreateQuestionInput): Promise<CreateQuestionResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      content,
      title,
    });

    const attachments = attachmentIds.map((attachmentId) =>
      QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      })
    );

    question.attachments = new QuestionAttachmentList(attachments);

    await this.repository.create(question);

    return right({
      question,
    });
  }
}
