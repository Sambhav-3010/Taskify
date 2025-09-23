import Event, { IEvent } from '../models/Event';
import User from '../models/User';
import { FilterQuery, Types } from 'mongoose';

export async function create(eventData: IEvent, userId: Types.ObjectId): Promise<IEvent> {
  const event = new Event({ ...eventData, userId: userId });
  const savedEvent = await event.save();
  await User.findByIdAndUpdate(userId, { $push: { events: savedEvent._id } });
  return savedEvent;
}

export async function find(filters: FilterQuery<IEvent>, page: number, limit: number, userId: Types.ObjectId): Promise<IEvent[]> {
  return await Event.find({ ...filters, userId: userId })
    .skip((page - 1) * limit)
    .limit(limit);
}

export async function count(filters: FilterQuery<IEvent>, userId: Types.ObjectId): Promise<number> {
  return await Event.countDocuments({ ...filters, userId: userId });
}

export async function findById(id: string, userId: Types.ObjectId): Promise<IEvent | null> {
  return await Event.findOne({ _id: id, userId: userId });
}

export async function update(id: string, eventData: Partial<IEvent>, userId: Types.ObjectId): Promise<IEvent | null> {
  return await Event.findOneAndUpdate({ _id: id, userId: userId }, eventData, { new: true });
}

export async function deleteEvent(id: string, userId: Types.ObjectId): Promise<IEvent | null> {
  const deletedEvent = await Event.findOneAndDelete({ _id: id, userId: userId });
  if (deletedEvent) {
    await User.findByIdAndUpdate(userId, { $pull: { events: deletedEvent._id } });
  }
  return deletedEvent;
}
