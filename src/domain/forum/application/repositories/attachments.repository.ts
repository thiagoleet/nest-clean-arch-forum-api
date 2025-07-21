import { Attachment } from '../../enterprise/entities';

export abstract class AttachmentsRepository {
  abstract create(attachment: Attachment): Promise<void>;
}
