import { Request, Response } from 'express';
import { createEvent, getEvents, updateEvent, deleteEvent } from '../services/EventService';
import { Types } from 'mongoose';

export async function createEventHandler(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?._id as Types.ObjectId;
    const event = await createEvent(req.body, userId);
    res.status(201).json(event);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function getEventsHandler(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?._id as Types.ObjectId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filters = req.query;
    const { events, totalPages, currentPage } = await getEvents(filters, page, limit, userId);
    res.status(200).json({ events, totalPages, currentPage });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function updateEventHandler(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?._id as Types.ObjectId;
    const event = await updateEvent(req.params.id, req.body, userId);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.status(200).json(event);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function deleteEventHandler(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?._id as Types.ObjectId;
    const event = await deleteEvent(req.params.id, userId);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
