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

  async findEventById(id: string, userId: Types.ObjectId): Promise<IEvent | null> {
    return await Event.findOne({ _id: id, userId }).populate('userId', 'username email');
  }

  async updateEvent(id: string, eventData: Partial<IEvent>, userId: Types.ObjectId): Promise<IEvent | null> {
    return await Event.findOneAndUpdate({ _id: id, userId }, eventData, { new: true });
  }

  async deleteEvent(id: string, userId: Types.ObjectId): Promise<IEvent | null> {
    return await Event.findOneAndDelete({ _id: id, userId });
  }
}
