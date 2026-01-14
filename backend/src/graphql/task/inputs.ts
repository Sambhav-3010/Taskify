export const taskInputs = `#graphql
  input CreateTaskInput {
    title: String!
    status: String
    priority: String
    deadline: String!
    projectId: ID
  }

  input UpdateTaskInput {
    title: String
    status: String
    priority: String
    deadline: String
    projectId: ID
  }

  input TaskFilterInput {
    projectId: ID
    status: String
    priority: String
    deadlineStart: String
    deadlineEnd: String
  }
`;
