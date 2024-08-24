import { QuestionComment } from "@/domain/forum/enterprise/entities";
import { UniqueEntityID } from "@/core/entities";
import { QuestionsRepository } from "../../repositories/questions.repository";
import { QuestionCommentRepository } from "../../repositories/question-comments.repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors";

interface CommentOnQuestionInput {
  authorId: string;
  questionId: string;
  content: string;
}

type CommentOnQuestionResponse = Either<
  ResourceNotFoundError,
  { comment: QuestionComment }
>;

export class CommentOnQuestionUseCase {
  constructor(
    private questionCommentsRepository: QuestionCommentRepository,
    private questionsRepository: QuestionsRepository
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionInput): Promise<CommentOnQuestionResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError("Question not found"));
    }

    const comment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: question.id,
      content,
    });

    await this.questionCommentsRepository.create(comment);

    return right({ comment });
  }
}
