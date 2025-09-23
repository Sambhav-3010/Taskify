
import Project, { IProject } from '../models/Project';
import User from '../models/User';
import { Types } from 'mongoose';

export class ProjectRepository {
  async create(projectData: IProject, userId: Types.ObjectId): Promise<IProject> {
    const project = new Project({ ...projectData, user: userId });
    const savedProject = await project.save();
    await User.findByIdAndUpdate(userId, { $push: { projects: savedProject._id } });
    return savedProject;
  }

  async findAll(userId: Types.ObjectId): Promise<IProject[]> {
    return await Project.find({ user: userId });
  }

  async findById(id: string, userId: Types.ObjectId): Promise<IProject | null> {
    return await Project.findOne({ _id: id, user: userId });
  }

  async delete(id: string, userId: Types.ObjectId): Promise<IProject | null> {
    const deletedProject = await Project.findOneAndDelete({ _id: id, user: userId });
    if (deletedProject) {
      await User.findByIdAndUpdate(userId, { $pull: { projects: deletedProject._id } });
    }
    return deletedProject;
  }
}
