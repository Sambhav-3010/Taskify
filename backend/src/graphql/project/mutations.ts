import { createProject, updateProject, deleteProject } from '../../services/ProjectService';
import { GraphQLContext } from '../context';
import { Types } from 'mongoose';
import { IProject } from '../../models/Project';

interface CreateProjectInput {
    name: string;
    description: string;
}

interface UpdateProjectInput {
    name?: string;
    description?: string;
}

export const projectMutations = {
    createProject: async (_: unknown, { input }: { input: CreateProjectInput }, context: GraphQLContext) => {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const userId = new Types.ObjectId(context.user.id);
        const project = await createProject(input as IProject, userId);

        return {
            id: String(project._id),
            name: project.name,
            description: project.description,
            createdAt: project.createdAt.toISOString(),
            userId: String(project.userId),
        };
    },

    updateProject: async (_: unknown, { id, input }: { id: string; input: UpdateProjectInput }, context: GraphQLContext) => {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const userId = new Types.ObjectId(context.user.id);
        const project = await updateProject(id, input, userId);

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

    deleteProject: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const userId = new Types.ObjectId(context.user.id);
        const project = await deleteProject(id, userId);

        if (!project) {
            return {
                message: 'Project not found',
                success: false,
            };
        }

        return {
            message: 'Project deleted successfully',
            success: true,
        };
    },
};
