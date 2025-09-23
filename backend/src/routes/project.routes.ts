
import { Router } from 'express';
import { createProject, listProjects, deleteProject } from '../controllers/ProjectController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, createProject);
router.get('/', requireAuth, listProjects);
router.delete('/:id', requireAuth, deleteProject);

export default router;
