import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { requireAuth } from '../middleware/auth';

const router = Router();
const eventController = new EventController();

router.post('/events', requireAuth, eventController.createEvent);
router.get('/events', requireAuth, eventController.getEvents);

export default router;
