
import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { requireAuth } from '../middleware/auth';

const router = Router();
const projectController = new ProjectController();

router.post('/', requireAuth, projectController.createProject.bind(projectController));
router.get('/', requireAuth, projectController.listProjects.bind(projectController));
router.delete('/:id', requireAuth, projectController.deleteProject.bind(projectController));

export default router;
