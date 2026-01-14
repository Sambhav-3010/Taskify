export const taskTypeDefs = `#graphql
  enum TaskStatus {
    todo
    in_progress
    done
  }

  enum TaskPriority {
    low
    medium
    high
  }

  type Task {
    id: ID!
    title: String!
    status: String!
    priority: String!
    deadline: String!
    projectId: ID
    project: Project
    userId: ID!
  }

  type TasksResponse {
    tasks: [Task!]!
    totalPages: Int!
    currentPage: Int!
  }

  extend type Query {
    tasks(filter: TaskFilterInput, page: Int, limit: Int): TasksResponse!
    task(id: ID!): Task
  }

  extend type Mutation {
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task
    deleteTask(id: ID!): DeleteResponse!
  }
`;
