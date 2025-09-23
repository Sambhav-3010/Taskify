import mongoose, { Document, Model, Schema , Types} from "mongoose";
import { IProject } from "./Project";
import { ITask } from "./Task";
import { IEvent } from "./Event";

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name?: string;
  createdAt: Date;
  projects: Types.ObjectId[] | IProject[]; // References to Project documents
  tasks: Types.ObjectId[] | ITask[];     // References to Task documents
  events: Types.ObjectId[] | IEvent[];   // References to Event documents
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String },
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
