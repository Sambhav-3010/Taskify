import { create as createRepo, find as findRepo, count as countRepo, findById as findByIdRepo, update as updateRepo, deleteEvent as deleteEventRepo } from '../repositories/EventRepository';
import { IEvent } from '../models/Event';
import { FilterQuery, Types } from 'mongoose';

export async function createEvent(eventData: IEvent, userId: Types.ObjectId): Promise<IEvent> {
  return await createRepo(eventData, userId);
}

export async function getEvents(filters: FilterQuery<IEvent>, page: number, limit: number, userId: Types.ObjectId): Promise<{ events: IEvent[], totalPages: number, currentPage: number }> {
  const totalEvents = await countRepo(filters, userId);
  const events = await findRepo(filters, page, limit, userId);
  const totalPages = Math.ceil(totalEvents / limit);
  return { events, totalPages, currentPage: page };
}

export async function updateEvent(id: string, eventData: Partial<IEvent>, userId: Types.ObjectId): Promise<IEvent | null> {
  return await updateRepo(id, eventData, userId);
}

export async function deleteEvent(id: string, userId: Types.ObjectId): Promise<IEvent | null> {
  return await deleteEventRepo(id, userId);
}
