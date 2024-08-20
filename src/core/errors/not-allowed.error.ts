import { UseCaseError } from "@/core/errors";

export class NotAllowedError extends Error implements UseCaseError {
  constructor(message: string = "Not Allowed") {
    super(message);
    this.name = "NotAllowedError";
  }
}
