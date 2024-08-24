import { Either, left, right } from "@/core/either";
import { QuestionAttachmentsRepository } from "../../repositories/question-attachments.repository";
import { QuestionsRepository } from "../../repositories/questions.repository";
import { NotAllowedError, ResourceNotFoundError } from "@/core/errors";
import {
  Question,
  QuestionAttachment,
  QuestionAttachmentList,
} from "@/domain/forum/enterprise/entities";
import { UniqueEntityID } from "@/core/entities";

interface EditQuestionInput {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
  attachmentIds: string[];
}

type EditQuestionResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

export class EditQuestionUseCase {
  constructor(
    private repository: QuestionsRepository,
    private attachmentsRepository: QuestionAttachmentsRepository
  ) {}

  async execute({
    questionId,
    authorId,
    title,
    content,
    attachmentIds,
  }: EditQuestionInput): Promise<EditQuestionResponse> {
    const question = await this.repository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError("Question not found"));
    }

    if (authorId != question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    // Handle attachements
    const attachments = await this.handleAttachments(question, attachmentIds);

    question.title = title;
    question.content = content;
    question.attachments = attachments;

    await this.repository.save(question);

    return right({});
  }

  private async handleAttachments(
    question: Question,
    attachmentIds: string[]
  ): Promise<QuestionAttachmentList> {
    const currentQuestionAttachments =
      await this.attachmentsRepository.findManyByQuestionId(
        question.id.toString()
      );

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments
    );
    const questionAttachments = attachmentIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      });
    });

    questionAttachmentList.update(questionAttachments);

    return questionAttachmentList;
  }
}
