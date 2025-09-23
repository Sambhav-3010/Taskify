
import { TaskRepository } from '../repositories/TaskRepository';
import { ITask } from '../models/Task';
import { FilterQuery } from 'mongoose';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async createTask(taskData: ITask): Promise<ITask> {
    return await this.taskRepository.create(taskData);
  }

  async getTasks(filters: FilterQuery<ITask>, page: number, limit: number): Promise<{ tasks: ITask[], totalPages: number, currentPage: number }> {
    const totalTasks = await this.taskRepository.count(filters);
    const tasks = await this.taskRepository.find(filters, page, limit);
    const totalPages = Math.ceil(totalTasks / limit);
    return { tasks, totalPages, currentPage: page };
  }

  async updateTask(id: string, taskData: Partial<ITask>): Promise<ITask | null> {
    return await this.taskRepository.update(id, taskData);
  }

  async deleteTask(id: string): Promise<ITask | null> {
    return await this.taskRepository.delete(id);
  }
}
