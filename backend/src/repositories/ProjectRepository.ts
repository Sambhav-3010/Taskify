import Project, { IProject } from '../models/Project';
import User from '../models/User';
import { Types } from 'mongoose';

export async function create(projectData: IProject, userId: Types.ObjectId): Promise<IProject> {
  const project = new Project({ ...projectData, userId: userId });
  const savedProject = await project.save();
  await User.findByIdAndUpdate(userId, { $push: { projects: savedProject._id } });
  return savedProject;
}

export async function findAll(userId: Types.ObjectId): Promise<IProject[]> {
  return await Project.find({ userId: userId });
}

export async function findById(id: string, userId: Types.ObjectId): Promise<IProject | null> {
  return await Project.findOne({ _id: id, userId: userId });
}

export async function deleteProject(id: string, userId: Types.ObjectId): Promise<IProject | null> {
  const deletedProject = await Project.findOneAndDelete({ _id: id, userId: userId });
  if (deletedProject) {
    await User.findByIdAndUpdate(userId, { $pull: { projects: deletedProject._id } });
  }
  return deletedProject;
}
