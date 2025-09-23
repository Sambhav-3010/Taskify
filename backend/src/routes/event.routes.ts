import { Router } from 'express';
import { createEventHandler, getEventsHandler, updateEventHandler, deleteEventHandler } from '../controllers/EventController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, createEventHandler);
router.get('/', requireAuth, getEventsHandler);
router.put('/:id', requireAuth, updateEventHandler);
router.delete('/:id', requireAuth, deleteEventHandler);

export default router;
