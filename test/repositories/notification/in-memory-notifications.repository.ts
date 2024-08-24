import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications.repository";
import { Notification } from "@/domain/notification/enterprise/entities";

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  private _items: Notification[];

  constructor() {
    this._items = [];
  }

  get items() {
    return this._items;
  }

  async create(notification: Notification): Promise<void> {
    this._items.push(notification);
  }

  async findById(id: string): Promise<Notification | null> {
    return (
      this._items.find((notification) => notification.id.toString() === id) ||
      null
    );
  }

  async save(notification: Notification): Promise<void> {
    const index = this._items.findIndex(
      (item) => item.id.toString() === notification.id.toString()
    );

    if (index >= 0) {
      this._items[index] = notification;
    }
  }
}
