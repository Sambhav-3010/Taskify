
import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { requireAuth } from '../middleware/auth';

const router = Router();
const taskController = new TaskController();

router.post('/', requireAuth, taskController.createTask.bind(taskController));
router.get('/', requireAuth, taskController.getTasks.bind(taskController));
router.put('/:id', requireAuth, taskController.updateTask.bind(taskController));
router.delete('/:id', requireAuth, taskController.deleteTask.bind(taskController));

export default router;
