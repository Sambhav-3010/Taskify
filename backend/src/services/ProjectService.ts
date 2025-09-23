
import { ProjectRepository } from '../repositories/ProjectRepository';
import { IProject } from '../models/Project';
import { Types } from 'mongoose';

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  async createProject(projectData: IProject, userId: Types.ObjectId): Promise<IProject> {
    return await this.projectRepository.create(projectData, userId);
  }

  async listProjects(userId: Types.ObjectId): Promise<IProject[]> {
    return await this.projectRepository.findAll(userId);
  }

  async deleteProject(id: string, userId: Types.ObjectId): Promise<IProject | null> {
    return await this.projectRepository.delete(id, userId);
  }
}
