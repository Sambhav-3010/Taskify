
import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  createdAt: Date;
  userId: Schema.Types.ObjectId;
}

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model<IProject>('Project', ProjectSchema);
