import { InMemoryNotificationsRepository } from "test/repositories/notification/in-memory-notifications.repository";
import { ReadNotificationUseCase } from "./read-notification";
import { makeNotification } from "test/factories/notification/make-notification";
import { UniqueEntityID } from "@/core/entities";
import { NotAllowedError, ResourceNotFoundError } from "@/core/errors";

describe("ReadNotificationUseCase", () => {
  let repository: InMemoryNotificationsRepository;
  let sut: ReadNotificationUseCase;

  beforeEach(() => {
    repository = new InMemoryNotificationsRepository();
    sut = new ReadNotificationUseCase(repository);
  });

  it("should be able to read a notification", async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityID("receipient-id"),
    });

    await repository.create(notification);

    await sut.execute({
      notificationId: notification.id.toString(),
      receipientId: notification.recipientId.toString(),
    });

    const [item] = repository.items;

    expect(item.readAt).toEqual(expect.any(Date));
  });

  it("shoud not be able to read a notification if it not exists", async () => {
    const result = await sut.execute({
      notificationId: "notification-id",
      receipientId: "receipient-id",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("shoud not be able to read a notification if it not belongs to the user", async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityID("receipient-id"),
    });

    await repository.create(notification);

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      receipientId: "wrong-receipient-id",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
