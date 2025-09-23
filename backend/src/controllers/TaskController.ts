
import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { FilterQuery } from 'mongoose';
import { ITask } from '../models/Task';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const task = await this.taskService.createTask(req.body);
      res.status(201).json(task);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const { projectId, status, priority, deadlineStart, deadlineEnd, page = 1, limit = 10 } = req.query;
      const filters: FilterQuery<ITask> = {};

      if (projectId) {
        filters.projectId = projectId;
      }
      if (status) {
        filters.status = status;
      }
      if (priority) {
        filters.priority = priority;
      }
      if (deadlineStart || deadlineEnd) {
        filters.deadline = {};
        if (deadlineStart) {
          filters.deadline.$gte = new Date(deadlineStart as string);
        }
        if (deadlineEnd) {
          filters.deadline.$lte = new Date(deadlineEnd as string);
        }
      }

      const { tasks, totalPages, currentPage } = await this.taskService.getTasks(filters, Number(page), Number(limit));
      res.status(200).json({ tasks, totalPages, currentPage });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const task = await this.taskService.updateTask(id, req.body);
      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }
      res.status(200).json(task);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const task = await this.taskService.deleteTask(id);
      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
