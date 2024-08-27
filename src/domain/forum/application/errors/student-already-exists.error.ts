import { UseCaseError } from '@/core/errors';

export class StudentAlreadyExistsError extends Error implements UseCaseError {
  constructor(message = 'Student already exists') {
    super(message);

    this.message = message;
    this.name = 'StudentAlreadyExistsError';
  }
}
