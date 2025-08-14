// Nest
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';

// Use cases
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification';

// Presenters

// Decorators
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/token.schema';

@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
  constructor(private useCase: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('notificationId') notificationId: string,
  ) {
    const result = await this.useCase.execute({
      notificationId,
      receipientId: user.sub,
    });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}
