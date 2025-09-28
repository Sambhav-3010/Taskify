import Event, { IEvent } from '../models/Event';
import { Types } from 'mongoose';

export class EventRepository {
  async createEvent(eventData: Partial<IEvent>): Promise<IEvent> {
    const event = new Event(eventData);
    return await event.save();
  }

  async findEventsByUserId(userId: Types.ObjectId): Promise<IEvent[]> {
    return await Event.find({ userId }).populate('userId', 'username email'); // Populate user details if needed
  }
}
