export interface Project {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  userId: string;
}

export interface Task {
  _id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  deadline: string;
  projectId?: string; // Made optional
  userId: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  userId: string;
}
