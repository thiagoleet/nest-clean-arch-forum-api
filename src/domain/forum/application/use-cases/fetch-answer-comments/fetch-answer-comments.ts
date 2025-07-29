import { AnswerCommentsRepository } from '../../repositories/answer-comments.repository';
import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

interface FetchAnswerCommentsInput {
  page: number;
  answerId: string;
}

type FetchAnswerCommentsResponse = Either<
  Error,
  {
    comments: CommentWithAuthor[];
    page: number;
  }
>;

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private repository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsInput): Promise<FetchAnswerCommentsResponse> {
    const comments = await this.repository.findManyByAnswerIdWithAuthor(
      answerId,
      {
        page,
      },
    );

    return right({ comments, page });
  }
}
