import { UseCaseError } from '@/core/errors';

export class InvalidAttachmentTypeError extends Error implements UseCaseError {
  constructor(type: string) {
    const message = `File type "${type}" is not valid.`;

    super(message);

    this.message = message;
    this.name = 'InvalidAttachmentTypeError';
  }
}
