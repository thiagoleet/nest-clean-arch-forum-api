import { UniqueEntityID } from "@/core/entities";
import { DomainEvent } from "@/core/events";
import { Question } from "../entities";

export class QuestionBestAnswerChoosenEvent implements DomainEvent {
  public ocurredAt: Date;
  private _question: Question;
  private _bestAnswerId: UniqueEntityID;

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this._question = question;
    this._bestAnswerId = bestAnswerId;
    this.ocurredAt = new Date();
  }

  get question(): Question {
    return this._question;
  }

  get bestAnswerId(): UniqueEntityID {
    return this._bestAnswerId;
  }

  getAggregateId(): UniqueEntityID {
    return this._question.id;
  }
}
