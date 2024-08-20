import { QuestionComment } from "@/domain/forum/enterprise/entities";
import { QuestionCommentRepository } from "../../repositories/question-comments.repository";

interface FetchQuestionCommentsInput {
  page: number;
  questionId: string;
}

interface FetchQuestionCommentsResponse {
  comments: QuestionComment[];
}

export class FetchQuestionCommentsUseCase {
  constructor(private repository: QuestionCommentRepository) {}

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
