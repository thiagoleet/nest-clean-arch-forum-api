import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/auth/current-user.decorator';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { UserPayload } from '@/auth/token.schema';
import {
  createQuestionBodySchema,
  CreateQuestionBodySchema,
} from './create-question.schema';
import { ZodValidationPipe } from '@/pipes';
import { PrismaService } from '@/prisma/prisma.service';

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
  ) {
    const { title, content } = body;

    await this.prisma.question.create({
      data: {
        title,
        content,
        slug: this.convertToSlug(title),
        authorId: user.sub,
      },
    });
  }

  private convertToSlug(text: string): string {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '');

    return slugText;
  }
}
