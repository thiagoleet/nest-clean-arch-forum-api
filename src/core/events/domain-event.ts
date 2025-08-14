import { UniqueEntityID } from '../entities';

export interface DomainEvent {
  ocurredAt: Date;
  getAggregateId(): UniqueEntityID;
}
