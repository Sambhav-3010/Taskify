import { Request, Response } from 'express';
import { createProject as createProjectService, listProjects as listProjectsService, deleteProject as deleteProjectService } from '../services/ProjectService';

export async function createProject(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    const project = await createProjectService(req.body, req.user._id);
    res.status(201).json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function listProjects(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    const projects = await listProjectsService(req.user._id);
    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteProject(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    const { id } = req.params;
    const project = await deleteProjectService(id, req.user._id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
