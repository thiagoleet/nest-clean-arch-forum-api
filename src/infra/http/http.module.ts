// nest
import { Module } from '@nestjs/common';

// modules
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { StorageModule } from '../storage/storage.module';

// controllers
import { AnswerQuestionController } from './controllers/answer-question';
import { AuthenticateController } from './controllers/authenticate';
import { CreateAccountController } from './controllers/create-account';
import { CreateQuestionController } from './controllers/create-question';
import { DeleteAnswerController } from './controllers/delete-answer';
import { DeleteQuestionController } from './controllers/delete-question';
import { EditAnswerController } from './controllers/edit-answer';
import { EditQuestionController } from './controllers/edit-question';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug';
import { FetchQuestionAnswersController } from './controllers/fetch-question-answers';
import { ChooseQuestionBestAsnwerController } from './controllers/choose-question-best-answer';
import { CommentOnQuestionController } from './controllers/comment-on-question';
import { DeleteQuestionCommentController } from './controllers/delete-question-comment';
import { CommentOnAnswerController } from './controllers/comment-on-answer';
import { DeleteAnswerCommentController } from './controllers/delete-answer-comment';
import { FetchQuestionCommentsController } from './controllers/fetch-question-comments';
import { FetchAnswerCommentsController } from './controllers/fetch-answer-comments';
import { UploadAttachmentController } from './controllers/upload-attachment';
import { ReadNotificationController } from './controllers/read-notification';

// providers
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers';
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer';
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question';
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment';
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer';
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment';
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments';
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment';
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification';

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    AnswerQuestionController,
    AuthenticateController,
    CreateAccountController,
    CreateQuestionController,
    DeleteAnswerController,
    DeleteQuestionController,
    EditAnswerController,
    EditQuestionController,
    FetchQuestionAnswersController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    ChooseQuestionBestAsnwerController,
    CommentOnQuestionController,
    DeleteQuestionCommentController,
    CommentOnAnswerController,
    DeleteAnswerCommentController,
    FetchQuestionCommentsController,
    FetchAnswerCommentsController,
    UploadAttachmentController,
    ReadNotificationController,
  ],
  providers: [
    AnswerQuestionUseCase,
    AuthenticateStudentUseCase,
    CreateQuestionUseCase,
    DeleteAnswerUseCase,
    DeleteQuestionUseCase,
    EditAnswerUseCase,
    EditQuestionUseCase,
    FetchRecentQuestionsUseCase,
    GetQuestionBySlugUseCase,
    RegisterStudentUseCase,
    FetchQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
    DeleteQuestionCommentUseCase,
    CommentOnAnswerUseCase,
    DeleteAnswerCommentUseCase,
    FetchQuestionCommentsUseCase,
    FetchAnswerCommentsUseCase,
    UploadAndCreateAttachmentUseCase,
    ReadNotificationUseCase,
  ],
})
export class HttpModule {}
