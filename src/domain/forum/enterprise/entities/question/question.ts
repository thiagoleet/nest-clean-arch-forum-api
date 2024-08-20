import dayjs from "dayjs";
import { AggregateRoot, UniqueEntityID } from "@/core/entities";
import { Optional } from "@/core/types/optional";
import { Slug } from "../value-objects";
import { QuestionAttachmentList } from "./question-attachment-list";
import { QuestionBestAnswerChoosenEvent } from "../../events";

export interface QuestionProps {
  authorId: UniqueEntityID;
  bestAnswerId?: UniqueEntityID;
  title: string;
  content: string;
  slug: Slug;
  attachments: QuestionAttachmentList;
  createdAt: Date;
  updatedAt?: Date;
}

export class Question extends AggregateRoot<QuestionProps> {
  get authorId() {
    return this.props.authorId;
  }

  get bestAnswerId() {
    return this.props.bestAnswerId;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get slug() {
    return this.props.slug;
  }

  get attachments() {
    return this.props.attachments;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get isNew(): boolean {
    return dayjs().diff(this.props.createdAt, "days") <= 3;
  }

  set title(value: string) {
    this.props.title = value;
    this.props.slug = Slug.createFromText(value);
    this.touch();
  }

  set content(value: string) {
    this.props.content = value;
    this.touch();
  }

  set bestAnswerId(value: UniqueEntityID | undefined) {
    if (value === undefined) {
      return;
    }

    if (
      this.props.bestAnswerId === undefined ||
      !this.props.bestAnswerId.equals(value)
    ) {
      this.addDomainEvent(new QuestionBestAnswerChoosenEvent(this, value));
    }

    this.props.bestAnswerId = value;
    this.touch();
  }

  set attachments(value: QuestionAttachmentList) {
    this.props.attachments = value;
    this.touch();
  }

  static create(
    props: Optional<QuestionProps, "createdAt" | "slug" | "attachments">,
    id?: UniqueEntityID
  ): Question {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return question;
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
