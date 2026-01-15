import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
    taskId?: Schema.Types.ObjectId;
    projectId?: Schema.Types.ObjectId;
    eventId?: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    textContent: string;
    codeBlocks: Array<{
        language: string;
        code: string;
    }>;
    drawingData: string; // JSON string of Excalidraw elements
    type: 'text' | 'code' | 'drawing';
    createdAt: Date;
    updatedAt: Date;
}

const CodeBlockSchema = new Schema({
    language: { type: String, default: 'javascript' },
    code: { type: String, default: '' },
}, { _id: false });

const NoteSchema: Schema = new Schema({
    taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' }, // Assuming Event model exists or will exist
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    textContent: { type: String, default: '' },
    codeBlocks: { type: [CodeBlockSchema], default: [] },
    drawingData: { type: String, default: '' },
    type: { type: String, enum: ['text', 'code', 'drawing'], default: 'text' },
}, {
    timestamps: true,
});

// Indexes for quick lookup
NoteSchema.index({ taskId: 1 });
NoteSchema.index({ projectId: 1 });
NoteSchema.index({ eventId: 1 });

export default mongoose.model<INote>('Note', NoteSchema);
