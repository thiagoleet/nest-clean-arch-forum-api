import { Notification } from "../../enterprise/entities";

export interface NotificationsRepository {
  create(notification: Notification): Promise<void>;
  findById(id: string): Promise<Notification | null>;
  save(notification: Notification): Promise<void>;
}
