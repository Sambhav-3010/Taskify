import { listProjects, getProjectById } from '../../services/ProjectService';
import { GraphQLContext } from '../context';
import { Types } from 'mongoose';

export const projectQueries = {
    projects: async (_: unknown, __: unknown, context: GraphQLContext) => {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const userId = new Types.ObjectId(context.user.id);
        const projects = await listProjects(userId);

        return projects.map(project => ({
            id: String(project._id),
            name: project.name,
            description: project.description,
            createdAt: project.createdAt.toISOString(),
            userId: String(project.userId),
        }));
    },

    project: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const userId = new Types.ObjectId(context.user.id);
        const project = await getProjectById(id, userId);

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
};
