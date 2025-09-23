
import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/TaskController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, createTask);
router.get('/', requireAuth, getTasks);
router.put('/:id', requireAuth, updateTask);
router.delete('/:id', requireAuth, deleteTask);

export default router;
