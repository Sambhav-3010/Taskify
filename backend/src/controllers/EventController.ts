import { Request, Response } from 'express';
import { EventService } from '../services/EventService';
import { EventRepository } from '../repositories/EventRepository';

const eventRepository = new EventRepository();
const eventService = new EventService(eventRepository);

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, date } = req.body;
    const userId = (req.user as any)._id;

    const event = await eventService.createEvent({ title, description, date, userId });
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)._id;
    const events = await eventService.getEventsByUserId(userId);
    res.status(200).json({ events });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};
