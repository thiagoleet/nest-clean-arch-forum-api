import { QuestionComment } from '@/domain/forum/enterprise/entities';
import { QuestionCommentsRepository } from '../../repositories/question-comments.repository';

interface FetchQuestionCommentsInput {
  page: number;
  questionId: string;
}

interface FetchQuestionCommentsResponse {
  comments: QuestionComment[];
}

export class FetchQuestionCommentsUseCase {
  constructor(private repository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsInput): Promise<FetchQuestionCommentsResponse> {
    const comments = await this.repository.findManyByQuestionId(questionId, {
      page,
    });

    return { comments };
  }
}
