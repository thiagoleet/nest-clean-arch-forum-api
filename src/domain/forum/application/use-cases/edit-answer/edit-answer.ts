import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities";
import { NotAllowedError, ResourceNotFoundError } from "@/core/errors";
import { AnswersRepository } from "../../repositories/answers.repository";
import { AnswerAttachmentsRepository } from "../../repositories/answer-attachments.repository";
import {
  Answer,
  AnswerAttachment,
  AnswerAttachmentList,
} from "@/domain/forum/enterprise/entities";

interface EditAnswerInput {
  authorId: string;
  answerId: string;
  content: string;
  attachmentIds: string[];
}

type EditAnswerResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

export class EditAnswerUseCase {
  constructor(
    private repository: AnswersRepository,
    private attachmentsRepository: AnswerAttachmentsRepository
  ) {}

  async execute({
    answerId,
    authorId,
    content,
    attachmentIds,
  }: EditAnswerInput): Promise<EditAnswerResponse> {
    const answer = await this.repository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError("Answer not found"));
    }

    if (authorId != answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    // Handle attachements
    const attachments = await this.handleAttachments(answer, attachmentIds);

    answer.content = content;
    answer.attachments = attachments;

    await this.repository.save(answer);

    return right({});
  }

  private async handleAttachments(
    answer: Answer,
    attachmentIds: string[]
  ): Promise<AnswerAttachmentList> {
    const currentQuestionAttachments =
      await this.attachmentsRepository.findManyByAnswerId(answer.id.toString());

    const questionAttachmentList = new AnswerAttachmentList(
      currentQuestionAttachments
    );
    const questionAttachments = attachmentIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      });
    });

    questionAttachmentList.update(questionAttachments);

    return questionAttachmentList;
  }
}
