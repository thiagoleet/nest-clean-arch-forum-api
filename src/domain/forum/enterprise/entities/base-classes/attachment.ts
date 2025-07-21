import { Entity, UniqueEntityID } from '@/core/entities';

interface AttachmentProps {
  title: string;
  url: string;
}

export class Attachment extends Entity<AttachmentProps> {
  get title() {
    return this.props.title;
  }

  get url() {
    return this.props.url;
  }

  set title(value: string) {
    this.props.title = value;
    this.touch();
  }

  static create(props: AttachmentProps, id?: UniqueEntityID): Attachment {
    const attachment = new Attachment(props, id);

    return attachment;
  }

  private touch(): void {}
}
