import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
    taskId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    textContent: string;
    codeBlocks: Array<{
        language: string;
        code: string;
    }>;
    drawingData: string; // JSON string of Excalidraw elements
    createdAt: Date;
    updatedAt: Date;
}

const CodeBlockSchema = new Schema({
    language: { type: String, default: 'javascript' },
    code: { type: String, default: '' },
}, { _id: false });

const NoteSchema: Schema = new Schema({
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    textContent: { type: String, default: '' },
    codeBlocks: { type: [CodeBlockSchema], default: [] },
    drawingData: { type: String, default: '' },
}, {
    timestamps: true,
});

// Index for quick lookup by taskId
NoteSchema.index({ taskId: 1 });

export default mongoose.model<INote>('Note', NoteSchema);
