import { Optional } from '@/core/types/optional';
import { UniqueEntityID } from '@/core/entities';
import { Comment, CommentProps } from '../base-classes/comment';

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityID;
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId;
  }

  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): AnswerComment {
    const answer = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return answer;
  }
}
