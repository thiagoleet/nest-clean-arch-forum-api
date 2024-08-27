import {
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

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenicateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const result = await this.authenicateStudent.execute({ email, password });

    if (result.isLeft()) {
      throw new UnauthorizedException();
    }

    const { accessToken } = result.value;

    return { accessToken };
  }
}
