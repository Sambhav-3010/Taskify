
import { Request, Response } from 'express';
import { ProjectService } from '../services/ProjectService';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  async createProject(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user._id) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const project = await this.projectService.createProject(req.body, req.user._id);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async listProjects(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user._id) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const projects = await this.projectService.listProjects(req.user._id);
      res.status(200).json(projects);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user._id) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const { id } = req.params;
      const project = await this.projectService.deleteProject(id, req.user._id);
      if (!project) {
        res.status(404).json({ message: 'Project not found' });
        return;
      }
      res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
