import { Router } from 'express';
import { createEvent, getEvents } from '../controllers/EventController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, createEvent);
router.get('/', requireAuth, getEvents);

export default router;
