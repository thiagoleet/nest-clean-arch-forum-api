import { UseCaseError } from '@/core/errors';

export class WrongCredentialsError extends Error implements UseCaseError {
  constructor(message: string = 'Credentials are not valid') {
    super(message);

    this.message = message;
    this.name = 'WrongCredentialsError';
  }
}
