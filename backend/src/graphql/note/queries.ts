import { getNote, getNoteById, getNotesForTasks, getUserNotes, getNotesByTask } from '../../services/NoteService';
import { GraphQLContext } from '../context';
import { Types } from 'mongoose';

export const noteQueries = {
    note: async (_: unknown, { taskId, projectId, eventId }: { taskId?: string; projectId?: string; eventId?: string }, context: GraphQLContext) => {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const userId = new Types.ObjectId(context.user.id);
        const note = await getNote({ taskId, projectId, eventId }, userId);

        if (!note) {
            return null;
        }

        return {
            id: String(note._id),
            taskId: note.taskId ? String(note.taskId) : undefined,
            projectId: note.projectId ? String(note.projectId) : undefined,
            eventId: note.eventId ? String(note.eventId) : undefined,
            userId: String(note.userId),
            title: note.title,
            description: note.description,
            textContent: note.textContent,
            codeBlocks: note.codeBlocks,
            drawingData: note.drawingData,
            type: note.type,
            createdAt: note.createdAt.toISOString(),
            updatedAt: note.updatedAt.toISOString(),
        };
    },

    noteById: async (_: unknown, { id }: { id: string }, context: GraphQLContext) => {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const userId = new Types.ObjectId(context.user.id);
        const note = await getNoteById(id, userId);

        if (!note) {
            return null;
        }

        return {
            id: String(note._id),
            taskId: note.taskId ? String(note.taskId) : undefined,
            projectId: note.projectId ? String(note.projectId) : undefined,
            eventId: note.eventId ? String(note.eventId) : undefined,
            userId: String(note.userId),
            title: note.title,
            description: note.description,
            textContent: note.textContent,
            codeBlocks: note.codeBlocks,
            drawingData: note.drawingData,
            type: note.type,
            createdAt: note.createdAt.toISOString(),
            updatedAt: note.updatedAt.toISOString(),
        };
    },

    tasksWithNotes: async (_: unknown, { taskIds }: { taskIds: string[] }, context: GraphQLContext) => {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const userId = new Types.ObjectId(context.user.id);
        return getNotesForTasks(taskIds, userId);
    },

    myNotes: async (_: unknown, __: unknown, context: GraphQLContext) => {
        if (!context.user) {
            throw new Error('Not authenticated');
        }
        const userId = new Types.ObjectId(context.user.id);
        const notes = await getUserNotes(userId);
        return notes.map(note => ({
            id: String(note._id),
            taskId: note.taskId ? String(note.taskId) : null,
            projectId: note.projectId ? String(note.projectId) : null,
            eventId: note.eventId ? String(note.eventId) : null,
            userId: String(note.userId),
            title: note.title,
            description: note.description,
            textContent: note.textContent,
            codeBlocks: note.codeBlocks,
            drawingData: note.drawingData,
            type: note.type,
            createdAt: note.createdAt.toISOString(),
            updatedAt: note.updatedAt.toISOString(),
        }));
    },

    notesByTask: async (_: unknown, { taskId }: { taskId: string }, context: GraphQLContext) => {
        if (!context.user) {
            throw new Error('Not authenticated');
        }
        const userId = new Types.ObjectId(context.user.id);
        const notes = await getNotesByTask(taskId, userId);
        return notes.map(note => ({
            id: String(note._id),
            taskId: note.taskId ? String(note.taskId) : null,
            projectId: note.projectId ? String(note.projectId) : null,
            eventId: note.eventId ? String(note.eventId) : null,
            userId: String(note.userId),
            title: note.title,
            description: note.description,
            textContent: note.textContent,
            codeBlocks: note.codeBlocks,
            drawingData: note.drawingData,
            type: note.type,
            createdAt: note.createdAt.toISOString(),
            updatedAt: note.updatedAt.toISOString(),
        }));
    },
};
