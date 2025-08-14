// NestJS
import { Module } from '@nestjs/common';

// Providers
import {
  OnAnswerCreated,
  OnQuestionBestAnswerChoosen,
} from '@/domain/notification/application/subscribers';
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification';

// Imports
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    OnAnswerCreated,
    OnQuestionBestAnswerChoosen,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
