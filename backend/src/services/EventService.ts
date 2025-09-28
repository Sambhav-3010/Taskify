import { EventRepository } from '../repositories/EventRepository';
import { IEvent } from '../models/Event';
import { Types } from 'mongoose';

export class EventService {
  private eventRepository: EventRepository;

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository;
  }

  async createEvent(eventData: Partial<IEvent>): Promise<IEvent> {
    return await this.eventRepository.createEvent(eventData);
  }

  async getEventsByUserId(userId: Types.ObjectId): Promise<IEvent[]> {
    return await this.eventRepository.findEventsByUserId(userId);
  }
}
