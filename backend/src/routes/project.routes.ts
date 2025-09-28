
import { Router } from 'express';
import { createProject, listProjects, getProjectById, updateProject, deleteProject } from '../controllers/ProjectController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, createProject);
router.get('/', requireAuth, listProjects);
router.get('/:id', requireAuth, getProjectById);
router.put('/:id', requireAuth, updateProject);
router.delete('/:id', requireAuth, deleteProject);

export default router;
