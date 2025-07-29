import { QuestionCommentsRepository } from '../../repositories/question-comments.repository';
import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

interface FetchQuestionCommentsInput {
  page: number;
  questionId: string;
}

type FetchQuestionCommentsResponse = Either<
  Error,
  {
    comments: CommentWithAuthor[];
    page: number;
  }
>;

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(private repository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsInput): Promise<FetchQuestionCommentsResponse> {
    const comments = await this.repository.findManyByQuestionIdWithAuthor(
      questionId,
      {
        page,
      },
    );

    return right({ comments, page });
  }
}
