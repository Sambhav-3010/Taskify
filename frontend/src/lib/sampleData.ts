import {Event} from "./models"

export const initialEvents: Event[] = [
  {
    id: "1",
    title: "All-Hands Meeting",
    date: "2024-01-15T11:00:00",
    status: "Upcoming",
    tasks: [
      { id: "1", title: "Confirm agenda", status: "Completed" },
      { id: "2", title: "Send invites", status: "In Progress" },
      { id: "3", title: "Prepare presentation", status: "Pending" },
    ],
  },
  {
    id: "2",
    title: "Product Launch Event",
    date: "2024-01-20T14:00:00",
    status: "In Progress",
    tasks: [
      { id: "4", title: "Book venue", status: "Completed" },
      { id: "5", title: "Design marketing materials", status: "In Progress" },
      { id: "6", title: "Coordinate catering", status: "Pending" },
    ],
  },
]

export const activeUsers = [
  { id: "1", name: "Alice Johnson", initials: "AJ" },
  { id: "2", name: "Bob Smith", initials: "BS" },
  { id: "3", name: "Carol Davis", initials: "CD" },
]