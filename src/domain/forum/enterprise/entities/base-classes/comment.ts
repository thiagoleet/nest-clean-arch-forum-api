import { Entity } from "@/core/entities";
import { UniqueEntityID } from "./value-objects";

export interface CommentProps {
  authorId: UniqueEntityID;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
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

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set content(value: string) {
    this.props.content = value;
    this.touch();
  }

  protected touch(): void {
    this.props.updatedAt = new Date();
  }
}
