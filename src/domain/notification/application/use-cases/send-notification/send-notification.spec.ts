import { SendNotificationUseCase } from "./send-notification";
import { InMemoryNotificationsRepository } from "test/repositories/notification/in-memory-notifications.repository";
import { Notification } from "@/domain/notification/enterprise/entities";

describe("SendNotificationUseCase", () => {
  let repository: InMemoryNotificationsRepository;
  let sut: SendNotificationUseCase;

  beforeEach(() => {
    repository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(repository);
  });

  it("should be able to create an answer question", async () => {
    const { value } = await sut.execute({
      receipientId: "receipient-id",
      title: "New Notification",
      content: "Content",
    });

    const { notification } = value as { notification: Notification };
    const [item] = repository.items;

    expect(notification.id).toBeTruthy();
    expect(item.id).toEqual(notification.id);
  });
});
