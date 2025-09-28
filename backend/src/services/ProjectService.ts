import { create as createRepo, findAll as findAllRepo, findById as findByIdRepo, update as updateRepo, deleteProject as deleteProjectRepo } from '../repositories/ProjectRepository';
import { IProject } from '../models/Project';
import { Types } from 'mongoose';

export async function createProject(projectData: IProject, userId: Types.ObjectId): Promise<IProject> {
  return await createRepo(projectData, userId);
}

export async function listProjects(userId: Types.ObjectId): Promise<IProject[]> {
  return await findAllRepo(userId);
}

export async function getProjectById(id: string, userId: Types.ObjectId): Promise<IProject | null> {
  return await findByIdRepo(id, userId);
}

export async function updateProject(id: string, projectData: Partial<IProject>, userId: Types.ObjectId): Promise<IProject | null> {
  return await updateRepo(id, projectData, userId);
}

export async function deleteProject(id: string, userId: Types.ObjectId): Promise<IProject | null> {
  return await deleteProjectRepo(id, userId);
}
