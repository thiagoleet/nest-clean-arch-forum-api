import { Module } from '@nestjs/common';

import { StudentsRepository } from '@/domain/forum/application/repositories/students.repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';

import { PrismaService } from './prisma/prisma.service';

import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments.repository';
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments.repository';
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers.repository';
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments.repository';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments.repository';
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions.repository';
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students.repository';

@Module({
  providers: [
    PrismaService,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    { provide: QuestionsRepository, useClass: PrismaQuestionsRepository },
    { provide: StudentsRepository, useClass: PrismaStudentsRepository },
  ],
  exports: [
    PrismaService,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    QuestionsRepository,
    StudentsRepository,
  ],
})
export class DatabaseModule {}
