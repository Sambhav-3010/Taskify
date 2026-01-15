import Note, { INote } from '../models/Note';
import { Types, FilterQuery } from 'mongoose';

interface CodeBlock {
    language: string;
    code: string;
}

interface NoteInput {
    title?: string;
    description?: string;
    textContent?: string;
    codeBlocks?: CodeBlock[];
    drawingData?: string;
    type?: 'text' | 'code' | 'drawing';
}

export async function getNote(
    target: { taskId?: string; projectId?: string; eventId?: string },
    userId: Types.ObjectId
): Promise<INote | null> {
    const query: FilterQuery<INote> = { userId };
    if (target.taskId) query.taskId = target.taskId;
    if (target.projectId) query.projectId = target.projectId;
    if (target.eventId) query.eventId = target.eventId;

    return Note.findOne(query);
}

// Get note by ID
export async function getNoteById(
    noteId: string,
    userId: Types.ObjectId
): Promise<INote | null> {
    return Note.findOne({ _id: noteId, userId });
}

// Deprecated: keeping for backward compatibility if needed, but should use getNote
export async function getNoteByTaskId(taskId: string, userId: Types.ObjectId): Promise<INote | null> {
    return getNote({ taskId }, userId);
}

// Create or update note for a target (task, project, or event) OR by noteId
export async function upsertNote(
    target: { taskId?: string; projectId?: string; eventId?: string },
    input: NoteInput,
    userId: Types.ObjectId,
    noteId?: string // Optional note ID for direct updates
): Promise<INote> {
    let existingNote: INote | null = null;

    if (noteId) {
        // If noteId is provided, look for that specific note first
        existingNote = await Note.findOne({ _id: noteId, userId });
        if (!existingNote) {
            throw new Error('Note not found');
        }
    } else {
        // Fallback to finding by target (legacy behavior / initial creation for associated notes)
        const query: FilterQuery<INote> = { userId };
        let hasTarget = false;

        if (target.taskId) { query.taskId = target.taskId; hasTarget = true; }
        if (target.projectId) { query.projectId = target.projectId; hasTarget = true; }
        if (target.eventId) { query.eventId = target.eventId; hasTarget = true; }

        if (hasTarget) {
            existingNote = await Note.findOne(query);
        }
    }

    if (existingNote) {
        // Update existing note
        if (input.title !== undefined) {
            existingNote.title = input.title;
        }
        if (input.description !== undefined) {
            existingNote.description = input.description;
        }
        if (input.textContent !== undefined) {
            existingNote.textContent = input.textContent;
        }
        if (input.codeBlocks !== undefined) {
            existingNote.codeBlocks = input.codeBlocks;
        }
        if (input.drawingData !== undefined) {
            existingNote.drawingData = input.drawingData;
        }

        if (target.taskId) existingNote.taskId = new Types.ObjectId(target.taskId);
        if (target.projectId) existingNote.projectId = new Types.ObjectId(target.projectId);

        await existingNote.save();
        return existingNote;
    } else {
        const noteData: any = {
            userId,
            title: input.title || 'Untitled Note',
            description: input.description || '',
            textContent: input.textContent || '',
            codeBlocks: input.codeBlocks || [],
            drawingData: input.drawingData || '',
        };

        if (target.taskId) noteData.taskId = new Types.ObjectId(target.taskId);
        if (target.projectId) noteData.projectId = new Types.ObjectId(target.projectId);
        if (target.eventId) noteData.eventId = new Types.ObjectId(target.eventId);

        const note = new Note(noteData);
        await note.save();
        return note;
    }
}

export async function deleteNoteByTaskId(taskId: string, userId: Types.ObjectId): Promise<boolean> {
    const result = await Note.deleteOne({ taskId, userId });
    return result.deletedCount > 0;
}

export async function deleteNote(noteId: string, userId: Types.ObjectId): Promise<boolean> {
    const result = await Note.deleteOne({ _id: noteId, userId });
    return result.deletedCount > 0;
}

export async function taskHasNote(taskId: string, userId: Types.ObjectId): Promise<boolean> {
    const count = await Note.countDocuments({ taskId, userId });
    return count > 0;
}

export async function getNotesForTasks(taskIds: string[], userId: Types.ObjectId): Promise<string[]> {
    const notes = await Note.find({
        taskId: { $in: taskIds.map(id => new Types.ObjectId(id)) },
        userId,
    }).select('taskId');

    return notes.map(n => String(n.taskId));
}

export async function getUserNotes(userId: Types.ObjectId): Promise<INote[]> {
    return Note.find({ userId }).sort({ updatedAt: -1 });
}
