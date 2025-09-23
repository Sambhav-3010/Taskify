export interface Project {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  deadline: string;
  projectId: string; // This will be the Project ID
}

export interface Event {
  id: string
  title: string
  date: string
  status: "Upcoming" | "In Progress" | "Completed"
  tasks: Task[]
}