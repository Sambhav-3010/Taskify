import { getTasks, getTaskById } from '../../services/TaskService';
import { getProjectById } from '../../services/ProjectService';
import { GraphQLContext } from '../context';
import { Types, FilterQuery } from 'mongoose';
import { ITask } from '../../models/Task';

interface TaskFilterInput {
    projectId?: string;
    status?: string;
    priority?: string;
    deadlineStart?: string;
    deadlineEnd?: string;
}

export const taskQueries = {
    tasks: async (
        _: unknown,
        { filter, page = 1, limit = 10 }: { filter?: TaskFilterInput; page?: number; limit?: number },
        context: GraphQLContext
    ) => {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const userId = new Types.ObjectId(context.user.id);
        const filters: FilterQuery<ITask> = {};

        if (filter) {
            if (filter.projectId) {
                filters.projectId = filter.projectId;
            }
            if (filter.status) {
                filters.status = filter.status;
            }
            if (filter.priority) {
                filters.priority = filter.priority;
            }
            if (filter.deadlineStart || filter.deadlineEnd) {
                filters.deadline = {};
                if (filter.deadlineStart) {
                    filters.deadline.$gte = new Date(filter.deadlineStart);
                }
                if (filter.deadlineEnd) {
                    filters.deadline.$lte = new Date(filter.deadlineEnd);
                }
            }
        }

        const result = await getTasks(filters, page, limit, userId);

        return {
            tasks: result.tasks.map(task => ({
                id: String(task._id),
                title: task.title,
                status: task.status,
                priority: task.priority,
                deadline: task.deadline.toISOString(),
                projectId: task.projectId ? String(task.projectId) : null,
                userId: String(task.userId),
            })),
            totalPages: result.totalPages,
            currentPage: result.currentPage,
        };
    },

    task: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const userId = new Types.ObjectId(context.user.id);
        const task = await getTaskById(id, userId);

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
};

// Field resolver for Task.project
export const taskFieldResolvers = {
    Task: {
        project: async (parent: { projectId?: string; userId: string }, _: unknown, context: GraphQLContext) => {
            if (!parent.projectId) {
                return null;
            }

            const userId = new Types.ObjectId(context.user?.id || parent.userId);
            const project = await getProjectById(parent.projectId, userId);

            if (!project) {
                return null;
            }

            return {
                id: String(project._id),
                name: project.name,
                description: project.description,
                createdAt: project.createdAt.toISOString(),
                userId: String(project.userId),
            };
        },
    },
};
