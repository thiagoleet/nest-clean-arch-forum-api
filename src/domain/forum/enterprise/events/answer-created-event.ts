import { UniqueEntityID } from "@/core/entities";
import { DomainEvent } from "@/core/events";
import { Answer } from "../entities";

export class AnswerCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  private _answer: Answer;

  constructor(answer: Answer) {
    this._answer = answer;
    this.ocurredAt = new Date();
  }

  get answer(): Answer {
    return this._answer;
  }

  public getAggregateId(): UniqueEntityID {
    return this._answer.id;
  }
}
