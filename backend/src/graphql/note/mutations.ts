import { upsertNote, deleteNoteByTaskId } from '../../services/NoteService';
import { GraphQLContext } from '../context';
import { Types } from 'mongoose';

interface CodeBlockInput {
    language: string;
    code: string;
}

interface NoteInput {
    textContent?: string;
    codeBlocks?: CodeBlockInput[];
    drawingData?: string;
}

export const noteMutations = {
    upsertNote: async (
        _: unknown,
        { taskId, projectId, eventId, input }: { taskId?: string; projectId?: string; eventId?: string; input: NoteInput },
        context: GraphQLContext
    ) => {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const userId = new Types.ObjectId(context.user.id);

        const note = await upsertNote({ taskId, projectId, eventId }, input, userId);

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

    deleteNote: async (_: unknown, { taskId }: { taskId: string }, context: GraphQLContext) => {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const userId = new Types.ObjectId(context.user.id);
        const success = await deleteNoteByTaskId(taskId, userId);

        return {
            message: success ? 'Note deleted successfully' : 'Note not found',
            success,
        };
    },
};
