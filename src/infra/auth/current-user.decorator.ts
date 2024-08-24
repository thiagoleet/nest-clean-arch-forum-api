import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from './token.schema';

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.user as UserPayload;
  },
);
