import { Entity, UniqueEntityID } from '@/core/entities';

export interface CommentProps {
  authorId: UniqueEntityID;
  content: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export abstract class Comment<
  Props extends CommentProps,
> extends Entity<Props> {
  get authorId() {
    return this.props.authorId;
  }

  get content() {
    return this.props.content;
  }

  set content(value: string) {
    this.props.content = value;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  protected touch(): void {
    this.props.updatedAt = new Date();
  }
}
