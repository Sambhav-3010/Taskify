
import Task, { ITask } from '../models/Task';
import User from '../models/User';
import { FilterQuery, Types } from 'mongoose';

export class TaskRepository {
  async create(taskData: ITask, userId: Types.ObjectId): Promise<ITask> {
    const task = new Task({ ...taskData, user: userId });
    const savedTask = await task.save();
    await User.findByIdAndUpdate(userId, { $push: { tasks: savedTask._id } });
    return savedTask;
  }

  async find(filters: FilterQuery<ITask>, page: number, limit: number, userId: Types.ObjectId): Promise<ITask[]> {
    return await Task.find({ ...filters, user: userId })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('projectId');
  }

  async count(filters: FilterQuery<ITask>, userId: Types.ObjectId): Promise<number> {
    return await Task.countDocuments({ ...filters, user: userId });
  }

  async findById(id: string, userId: Types.ObjectId): Promise<ITask | null> {
    return await Task.findOne({ _id: id, user: userId }).populate('projectId');
  }

  async update(id: string, taskData: Partial<ITask>, userId: Types.ObjectId): Promise<ITask | null> {
    return await Task.findOneAndUpdate({ _id: id, user: userId }, taskData, { new: true });
  }

  async delete(id: string, userId: Types.ObjectId): Promise<ITask | null> {
    const deletedTask = await Task.findOneAndDelete({ _id: id, user: userId });
    if (deletedTask) {
      await User.findByIdAndUpdate(userId, { $pull: { tasks: deletedTask._id } });
    }
    return deletedTask;
  }
}
