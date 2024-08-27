import {
  BadRequestException,
  ConflictException,
  UsePipes,
} from '@nestjs/common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  createAccountBodySchema,
  CreateAccountBodySchema,
} from './create-account.schema';
import { ZodValidationPipe } from '../../pipes';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { StudentAlreadyExistsError } from '@/domain/forum/application/errors';

@Controller('/accounts')
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
