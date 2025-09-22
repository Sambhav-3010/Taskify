export interface Task {
  id: string
  title: string
  status: "Pending" | "In Progress" | "Completed"
}

export interface Event {
  id: string
  title: string
  date: string
  status: "Upcoming" | "In Progress" | "Completed"
  tasks: Task[]
}