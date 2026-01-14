import { createTask, updateTask, deleteTask } from '../../services/TaskService';
import { GraphQLContext } from '../context';
import { Types } from 'mongoose';
import { ITask } from '../../models/Task';

interface CreateTaskInput {
    title: string;
    status?: string;
    priority?: string;
    deadline: string;
    projectId?: string;
}

interface UpdateTaskInput {
    title?: string;
    status?: string;
    priority?: string;
    deadline?: string;
    projectId?: string;
}

export const taskMutations = {
    createTask: async (_: unknown, { input }: { input: CreateTaskInput }, context: GraphQLContext) => {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const userId = new Types.ObjectId(context.user.id);
        const taskData = {
            ...input,
            deadline: new Date(input.deadline),
            projectId: input.projectId ? new Types.ObjectId(input.projectId) : undefined,
        } as unknown as ITask;

        const task = await createTask(taskData, userId);

        return {
            id: String(task._id),
            title: task.title,
            status: task.status,
            priority: task.priority,
            deadline: task.deadline.toISOString(),
            projectId: task.projectId ? String(task.projectId) : null,
            userId: String(task.userId),
        };
    },

    updateTask: async (_: unknown, { id, input }: { id: string; input: UpdateTaskInput }, context: GraphQLContext) => {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const userId = new Types.ObjectId(context.user.id);
        const updateData: Partial<ITask> = {};

        if (input.title !== undefined) updateData.title = input.title;
        if (input.status !== undefined) updateData.status = input.status as ITask['status'];
        if (input.priority !== undefined) updateData.priority = input.priority as ITask['priority'];
        if (input.deadline !== undefined) updateData.deadline = new Date(input.deadline);
        if (input.projectId !== undefined) {
            updateData.projectId = input.projectId ? new Types.ObjectId(input.projectId) as unknown as ITask['projectId'] : undefined;
        }

        const task = await updateTask(id, updateData, userId);

        if (!task) {
            return null;
        }

        return {
            id: String(task._id),
            title: task.title,
            status: task.status,
            priority: task.priority,
            deadline: task.deadline.toISOString(),
            projectId: task.projectId ? String(task.projectId) : null,
            userId: String(task.userId),
        };
    },

    deleteTask: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const userId = new Types.ObjectId(context.user.id);
        const task = await deleteTask(id, userId);

        if (!task) {
            return {
                message: 'Task not found',
                success: false,
            };
        }

        return {
            message: 'Task deleted successfully',
            success: true,
        };
    },
};
