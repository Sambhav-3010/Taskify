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

  async getEventById(id: string, userId: Types.ObjectId): Promise<IEvent | null> {
    return await this.eventRepository.findEventById(id, userId);
  }

  async updateEvent(id: string, eventData: Partial<IEvent>, userId: Types.ObjectId): Promise<IEvent | null> {
    return await this.eventRepository.updateEvent(id, eventData, userId);
  }

  async deleteEvent(id: string, userId: Types.ObjectId): Promise<IEvent | null> {
    return await this.eventRepository.deleteEvent(id, userId);
  }
}
