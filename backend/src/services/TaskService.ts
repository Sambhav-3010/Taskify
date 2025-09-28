import { create as createRepo, find as findRepo, count as countRepo, findById as findByIdRepo, update as updateRepo, deleteTask as deleteTaskRepo } from '../repositories/TaskRepository';
import { ITask } from '../models/Task';
import { FilterQuery, Types } from 'mongoose';

export async function createTask(taskData: ITask, userId: Types.ObjectId): Promise<ITask> {
  return await createRepo(taskData, userId);
}

export async function getTaskById(id: string, userId: Types.ObjectId): Promise<ITask | null> {
  return await findByIdRepo(id, userId);
}

export async function getTasks(filters: FilterQuery<ITask>, page: number, limit: number, userId: Types.ObjectId): Promise<{ tasks: ITask[], totalPages: number, currentPage: number }> {
  const totalTasks = await countRepo(filters, userId);
  const tasks = await findRepo(filters, page, limit, userId);
  const totalPages = Math.ceil(totalTasks / limit);
  return { tasks, totalPages, currentPage: page };
}

export async function updateTask(id: string, taskData: Partial<ITask>, userId: Types.ObjectId): Promise<ITask | null> {
  return await updateRepo(id, taskData, userId);
}

export async function deleteTask(id: string, userId: Types.ObjectId): Promise<ITask | null> {
  return await deleteTaskRepo(id, userId);
}
