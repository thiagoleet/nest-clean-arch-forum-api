// nest
import { Module } from '@nestjs/common';

// modules
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';

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

// providers
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/getQuestionBySlug';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers';

@Module({
  imports: [DatabaseModule, CryptographyModule],
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
  ],
})
export class HttpModule {}
