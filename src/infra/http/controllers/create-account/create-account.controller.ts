// Nest
import {
  BadRequestException,
  ConflictException,
  UsePipes,
} from '@nestjs/common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';

// Schemas
import {
  createAccountBodySchema,
  CreateAccountBodySchema,
} from './create-account.schema';

// Pipes
import { ZodValidationPipe } from '../../pipes';

// Use cases
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';

// Errors
import { StudentAlreadyExistsError } from '@/domain/forum/application/errors';

// Decorators
import { Public } from '@/infra/auth/public';

@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body;

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return { message: 'Account created successfully' };
  }
}
