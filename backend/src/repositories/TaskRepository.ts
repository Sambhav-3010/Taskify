import Task, { ITask } from '../models/Task';
import User from '../models/User';
import { FilterQuery, Types } from 'mongoose';

export async function create(taskData: ITask, userId: Types.ObjectId): Promise<ITask> {
  const task = new Task({ ...taskData, userId: userId });
  const savedTask = await task.save();
  await User.findByIdAndUpdate(userId, { $push: { tasks: savedTask._id } });
  return savedTask;
}

export async function find(filters: FilterQuery<ITask>, page: number, limit: number, userId: Types.ObjectId): Promise<ITask[]> {
  return await Task.find({ ...filters, userId: userId })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('projectId');
}

export async function count(filters: FilterQuery<ITask>, userId: Types.ObjectId): Promise<number> {
  return await Task.countDocuments({ ...filters, userId: userId });
}

export async function findById(id: string, userId: Types.ObjectId): Promise<ITask | null> {
  return await Task.findOne({ _id: id, userId: userId }).populate('projectId');
}

export async function update(id: string, taskData: Partial<ITask>, userId: Types.ObjectId): Promise<ITask | null> {
  return await Task.findOneAndUpdate({ _id: id, userId: userId }, taskData, { new: true });
}

export async function deleteTask(id: string, userId: Types.ObjectId): Promise<ITask | null> {
  const deletedTask = await Task.findOneAndDelete({ _id: id, userId: userId });
  if (deletedTask) {
    await User.findByIdAndUpdate(userId, { $pull: { tasks: deletedTask._id } });
  }
  return deletedTask;
}
