import { upsertNote, deleteNoteByTaskId, deleteNote } from '../../services/NoteService';
import { GraphQLContext } from '../context';
import { Types } from 'mongoose';

interface CodeBlockInput {
    language: string;
    code: string;
}

interface NoteInput {
    title?: string;
    description?: string;
    textContent?: string;
    codeBlocks?: CodeBlockInput[];
    drawingData?: string;
    type?: 'text' | 'code' | 'drawing';
}

export const noteMutations = {
    upsertNote: async (
        _: unknown,
        { id, taskId, projectId, eventId, input }: { id?: string; taskId?: string; projectId?: string; eventId?: string; input: NoteInput },
        context: GraphQLContext
    ) => {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const userId = new Types.ObjectId(context.user.id);

        const note = await upsertNote({ taskId, projectId, eventId }, input, userId, id);

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

    deleteNote: async (_: unknown, { id, taskId }: { id?: string; taskId?: string }, context: GraphQLContext) => {
        if (!context.user) {
            throw new Error('Not authenticated');
        }

        const userId = new Types.ObjectId(context.user.id);
        let success = false;

        if (id) {
            success = await deleteNote(id, userId);
        } else if (taskId) {
            success = await deleteNoteByTaskId(taskId, userId);
        } else {
            throw new Error('Either id or taskId must be provided');
        }

        return {
            message: success ? 'Note deleted successfully' : 'Note not found',
            success,
        };
    },
};
