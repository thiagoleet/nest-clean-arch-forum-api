import dayjs from 'dayjs';
import { AggregateRoot, UniqueEntityID } from '@/core/entities';
import { Optional } from '@/core/types/optional';
import { Slug } from '../value-objects';
import { QuestionAttachmentList } from './question-attachment-list';
import { QuestionBestAnswerChoosenEvent } from '../../events';

export interface QuestionProps {
  authorId: UniqueEntityID;
  bestAnswerId?: UniqueEntityID | null;
  title: string;
  content: string;
  slug: Slug;
  attachments: QuestionAttachmentList;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Question extends AggregateRoot<QuestionProps> {
  get authorId() {
    return this.props.authorId;
  }

  get bestAnswerId() {
    return this.props.bestAnswerId;
  }

  set bestAnswerId(value: UniqueEntityID | undefined | null) {
    if (value && value !== this.props.bestAnswerId) {
      this.addDomainEvent(new QuestionBestAnswerChoosenEvent(this, value));
    }

    this.props.bestAnswerId = value;
    this.touch();
  }

  get title() {
    return this.props.title;
  }

  set title(value: string) {
    this.props.title = value;
    this.props.slug = Slug.createFromText(value);
    this.touch();
  }

  get content() {
    return this.props.content;
  }

  set content(value: string) {
    this.props.content = value;
    this.touch();
  }

  get slug() {
    return this.props.slug;
  }

  get attachments() {
    return this.props.attachments;
  }

  set attachments(value: QuestionAttachmentList) {
    this.props.attachments = value;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get isNew(): boolean {
    return dayjs().diff(this.props.createdAt, 'days') <= 3;
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ): Question {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return question;
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
