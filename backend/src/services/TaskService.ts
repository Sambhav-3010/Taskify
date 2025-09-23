
import { TaskRepository } from '../repositories/TaskRepository';
import { ITask } from '../models/Task';
import { FilterQuery, Types } from 'mongoose';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async createTask(taskData: ITask, userId: Types.ObjectId): Promise<ITask> {
    return await this.taskRepository.create(taskData, userId);
  }

  async getTasks(filters: FilterQuery<ITask>, page: number, limit: number, userId: Types.ObjectId): Promise<{ tasks: ITask[], totalPages: number, currentPage: number }> {
    const totalTasks = await this.taskRepository.count(filters, userId);
    const tasks = await this.taskRepository.find(filters, page, limit, userId);
    const totalPages = Math.ceil(totalTasks / limit);
    return { tasks, totalPages, currentPage: page };
  }

  async updateTask(id: string, taskData: Partial<ITask>, userId: Types.ObjectId): Promise<ITask | null> {
    return await this.taskRepository.update(id, taskData, userId);
  }

  async deleteTask(id: string, userId: Types.ObjectId): Promise<ITask | null> {
    return await this.taskRepository.delete(id, userId);
  }
}
