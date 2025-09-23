
import Task, { ITask } from '../models/Task';
import { FilterQuery } from 'mongoose';

export class TaskRepository {
  async create(taskData: ITask): Promise<ITask> {
    const task = new Task(taskData);
    return await task.save();
  }

  async find(filters: FilterQuery<ITask>, page: number, limit: number): Promise<ITask[]> {
    return await Task.find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('projectId');
  }

  async count(filters: FilterQuery<ITask>): Promise<number> {
    return await Task.countDocuments(filters);
  }

  async findById(id: string): Promise<ITask | null> {
    return await Task.findById(id).populate('projectId');
  }

  async update(id: string, taskData: Partial<ITask>): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(id, taskData, { new: true });
  }

  async delete(id: string): Promise<ITask | null> {
    return await Task.findByIdAndDelete(id);
  }
}
