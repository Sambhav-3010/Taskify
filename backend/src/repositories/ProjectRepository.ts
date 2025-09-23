
import Project, { IProject } from '../models/Project';

export class ProjectRepository {
  async create(projectData: IProject): Promise<IProject> {
    const project = new Project(projectData);
    return await project.save();
  }

  async findAll(): Promise<IProject[]> {
    return await Project.find();
  }

  async findById(id: string): Promise<IProject | null> {
    return await Project.findById(id);
  }

  async delete(id: string): Promise<IProject | null> {
    return await Project.findByIdAndDelete(id);
  }
}
