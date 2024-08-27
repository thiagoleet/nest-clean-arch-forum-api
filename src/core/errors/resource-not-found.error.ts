import { UseCaseError } from '@/core/errors';

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor(message: string = 'Resource not found') {
    super(message);

    this.message = message;
    this.name = 'ResourceNotFoundError';
  }
}
