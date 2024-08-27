import { ConflictException, UsePipes } from '@nestjs/common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  createAccountBodySchema,
  CreateAccountBodySchema,
} from './create-account.schema';
import { ZodValidationPipe } from '../../pipes';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';

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
      throw new ConflictException(result.value.message);
    }

    return { message: 'Account created successfully' };
  }
}
