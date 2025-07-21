import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments.repository';
import { Attachment } from '@/domain/forum/enterprise/entities';

export class InMemoryAttachmentssRepository implements AttachmentsRepository {
  private _items: Attachment[];

  get items() {
    return this._items;
  }

  constructor() {
    this._items = [];
  }

  async create(attachment: Attachment): Promise<void> {
    this._items.push(attachment);
  }
}
