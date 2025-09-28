import { Router } from 'express';
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from '../controllers/EventController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, createEvent);
router.get('/', requireAuth, getEvents);
router.get('/:id', requireAuth, getEventById);
router.put('/:id', requireAuth, updateEvent);
router.delete('/:id', requireAuth, deleteEvent);

export default router;
