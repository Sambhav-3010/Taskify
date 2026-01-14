export const noteTypeDefs = `
  type CodeBlock {
    language: String!
    code: String!
  }

  type Note {
    id: ID!
    taskId: ID!
    userId: ID!
    textContent: String!
    codeBlocks: [CodeBlock!]!
    drawingData: String!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    note(taskId: ID!): Note
    tasksWithNotes(taskIds: [ID!]!): [ID!]!
  }

  extend type Mutation {
    upsertNote(taskId: ID!, input: NoteInput!): Note!
    deleteNote(taskId: ID!): DeleteResponse!
  }
`;
