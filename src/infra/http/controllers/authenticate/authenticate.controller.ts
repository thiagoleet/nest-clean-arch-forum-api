import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';

import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import {
  AuthenticateBodySchema,
  authenticateBodySchema,
} from './authenticate.schema';
import { ZodValidationPipe } from '../../pipes';
import { WrongCredentialsError } from '@/domain/forum/application/errors';

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenicateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const result = await this.authenicateStudent.execute({ email, password });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return { accessToken };
  }
}
