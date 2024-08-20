import { Entity } from "@/core/entities";
import { UniqueEntityID } from "./value-objects";

interface AttachmentProps {
  title: string;
  link: string;
}

export class Attachment extends Entity<AttachmentProps> {
  get title() {
    return this.props.title;
  }

  get link() {
    return this.props.link;
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
