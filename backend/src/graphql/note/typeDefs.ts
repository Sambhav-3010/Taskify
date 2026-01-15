export const noteTypeDefs = `#graphql
  type CodeBlock {
    language: String!
    code: String!
  }

  type Note {
    id: ID!
    taskId: ID
    projectId: ID
    eventId: ID
    userId: ID!
    title: String!
    description: String!
    textContent: String!
    codeBlocks: [CodeBlock!]!
    drawingData: String!
    type: String!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    note(taskId: ID, projectId: ID, eventId: ID): Note
    noteById(id: ID!): Note
    tasksWithNotes(taskIds: [ID!]!): [ID!]!
    myNotes: [Note!]!
  }

  extend type Mutation {
    upsertNote(id: ID, taskId: ID, projectId: ID, eventId: ID, input: NoteInput!): Note!
    deleteNote(id: ID, taskId: ID): DeleteResponse!
  }
`;
