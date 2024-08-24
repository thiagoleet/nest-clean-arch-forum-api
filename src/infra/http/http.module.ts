import { Module } from '@nestjs/common';
import { AuthenticateController } from './controllers/authenticate';
import { CreateAccountController } from './controllers/create-account';
import { CreateQuestionController } from './controllers/create-question';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
})
export class HttpModule {}
