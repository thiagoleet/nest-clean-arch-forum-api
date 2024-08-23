import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { PrismaService } from '@/infra/prisma/prisma.service';
import {
  PageQueryParamsSchema,
  queryValidationPipe,
} from './fetch-recent-questions.schema';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamsSchema,
  ) {
    const itemsPerPage = 10;

    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
    });

    return { questions, page, itemsPerPage };
  }
}
