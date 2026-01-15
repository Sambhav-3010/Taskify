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

// Get note by target
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

// Deprecated: keeping for backward compatibility if needed, but should use getNote
export async function getNoteByTaskId(taskId: string, userId: Types.ObjectId): Promise<INote | null> {
    return getNote({ taskId }, userId);
}

// Create or update note for a target (task, project, or event)
export async function upsertNote(
    target: { taskId?: string; projectId?: string; eventId?: string },
    input: NoteInput,
    userId: Types.ObjectId
): Promise<INote> {
    const query: FilterQuery<INote> = { userId };
    if (target.taskId) query.taskId = target.taskId;
    if (target.projectId) query.projectId = target.projectId;
    if (target.eventId) query.eventId = target.eventId;

    let existingNote = await Note.findOne(query);

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
        const noteData: any = {
            userId,
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

export async function getUserNotes(userId: Types.ObjectId): Promise<INote[]> {
    return Note.find({ userId }).sort({ updatedAt: -1 });
}
