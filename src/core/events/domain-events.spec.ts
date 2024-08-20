import { AggregateRoot, UniqueEntityID } from "../entities";
import { DomainEvent } from "./domain-event";
import { DomainEvents } from "./domain-events";
import { vi } from "vitest";

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date;
  private _agreggate: CustomAggregate;

  constructor(agreggate: CustomAggregate) {
    this._agreggate = agreggate;
    this.ocurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityID {
    return this._agreggate.id;
  }
}

class CustomAggregate extends AggregateRoot<any> {
  static create() {
    const agregate = new CustomAggregate(null);

    agregate.addDomainEvent(new CustomAggregateCreated(agregate));

    return agregate;
  }
}

describe("Domain Events", () => {
  it("should be able to dispatch and listen to events", () => {
    // Creating a spy
    const callbackSpy = vi.fn();

    // Listening to an event
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

    // Creating an instance of aggregate
    const aggregate = CustomAggregate.create();

    expect(aggregate.domainEvents).toHaveLength(1);

    // Dispatching an event
    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    expect(callbackSpy).toBeCalledTimes(1);
    expect(aggregate.domainEvents).toHaveLength(0);
  });
});
