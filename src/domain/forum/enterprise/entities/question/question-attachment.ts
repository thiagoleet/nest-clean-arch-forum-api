import { Entity } from "@/core/entities";
import { UniqueEntityID } from "../value-objects";

export interface QuestionAttachmentProps {
  questionId: UniqueEntityID;
  attachmentId: UniqueEntityID;
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  get questionId() {
    return this.props.questionId;
  }

  get attachmentId() {
    return this.props.attachmentId;
  }

  static create(
    props: QuestionAttachmentProps,
    id?: UniqueEntityID
  ): QuestionAttachment {
    const attachment = new QuestionAttachment(props, id);

    return attachment;
  }

  private touch(): void {}
}
