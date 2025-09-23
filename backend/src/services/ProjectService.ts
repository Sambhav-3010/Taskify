
import { ProjectRepository } from '../repositories/ProjectRepository';
import { IProject } from '../models/Project';

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  async createProject(projectData: IProject): Promise<IProject> {
    return await this.projectRepository.create(projectData);
  }

  async listProjects(): Promise<IProject[]> {
    return await this.projectRepository.findAll();
  }

  async deleteProject(id: string): Promise<IProject | null> {
    return await this.projectRepository.delete(id);
  }
}
