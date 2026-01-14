import { getNoteByTaskId, getNotesForTasks } from '../../services/NoteService';
import { GraphQLContext } from '../context';
import { Types } from 'mongoose';

export const noteQueries = {
    note: async (_: unknown, { taskId }: { taskId: string }, context: GraphQLContext) => {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const userId = new Types.ObjectId(context.user.id);
        const note = await getNoteByTaskId(taskId, userId);

        if (!note) {
            return null;
        }

        return {
            id: String(note._id),
            taskId: String(note.taskId),
            userId: String(note.userId),
            textContent: note.textContent,
            codeBlocks: note.codeBlocks,
            drawingData: note.drawingData,
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
};
