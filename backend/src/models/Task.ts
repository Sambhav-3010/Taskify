
import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  deadline: Date;
  projectId?: Schema.Types.ObjectId; // Made optional
  userId: Schema.Types.ObjectId;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  deadline: { type: Date, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: false }, // Made optional
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model<ITask>('Task', TaskSchema);
