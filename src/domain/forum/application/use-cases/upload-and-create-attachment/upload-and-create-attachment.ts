import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { InvalidAttachmentTypeError } from '../../errors';
import { Attachment } from '@/domain/forum/enterprise/entities';
import { AttachmentsRepository } from '../../repositories/attachments.repository';
import { Uploader } from '../../storage/uploader';

interface UploadAndCreateAttachmentInput {
  fileName: string;
  fileType: string;
  body: Buffer;
}

type UploadAndCreateAttachmentResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment;
  }
>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentInput): Promise<UploadAndCreateAttachmentResponse> {
    const validTypeRegex = /^(image\/(jpeg|png))$[^application\/pdf$]/;

    if (!validTypeRegex.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType));
    }

    const { url } = await this.uploader.upload({ fileName, fileType, body });

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    await this.attachmentsRepository.create(attachment);

    return right({ attachment });
  }
}
