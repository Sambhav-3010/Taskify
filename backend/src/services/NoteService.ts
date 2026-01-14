import Note, { INote } from '../models/Note';
import { Types, FilterQuery } from 'mongoose';

interface CodeBlock {
    language: string;
    code: string;
}

interface NoteInput {
    textContent?: string;
    codeBlocks?: CodeBlock[];
    drawingData?: string;
}

// Get note by task ID
export async function getNoteByTaskId(taskId: string, userId: Types.ObjectId): Promise<INote | null> {
    return Note.findOne({ taskId, userId });
}

// Create or update note for a task
export async function upsertNote(
    taskId: string,
    input: NoteInput,
    userId: Types.ObjectId
): Promise<INote> {
    const existingNote = await Note.findOne({ taskId, userId });

    if (existingNote) {
        // Update existing note
        if (input.textContent !== undefined) {
            existingNote.textContent = input.textContent;
        }
        if (input.codeBlocks !== undefined) {
            existingNote.codeBlocks = input.codeBlocks;
        }
        if (input.drawingData !== undefined) {
            existingNote.drawingData = input.drawingData;
        }
        await existingNote.save();
        return existingNote;
    } else {
        // Create new note
        const note = new Note({
            taskId: new Types.ObjectId(taskId),
            userId,
            textContent: input.textContent || '',
            codeBlocks: input.codeBlocks || [],
            drawingData: input.drawingData || '',
        });
        await note.save();
        return note;
    }
}

// Delete note by task ID
export async function deleteNoteByTaskId(taskId: string, userId: Types.ObjectId): Promise<boolean> {
    const result = await Note.deleteOne({ taskId, userId });
    return result.deletedCount > 0;
}

// Check if a task has a note
export async function taskHasNote(taskId: string, userId: Types.ObjectId): Promise<boolean> {
    const count = await Note.countDocuments({ taskId, userId });
    return count > 0;
}

// Get notes for multiple tasks (for displaying indicators)
export async function getNotesForTasks(taskIds: string[], userId: Types.ObjectId): Promise<string[]> {
    const notes = await Note.find({
        taskId: { $in: taskIds.map(id => new Types.ObjectId(id)) },
        userId,
    }).select('taskId');

    return notes.map(n => String(n.taskId));
}
