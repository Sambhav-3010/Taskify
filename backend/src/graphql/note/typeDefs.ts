export const noteTypeDefs = `
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
    textContent: String!
    codeBlocks: [CodeBlock!]!
    drawingData: String!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    note(taskId: ID, projectId: ID, eventId: ID): Note
    tasksWithNotes(taskIds: [ID!]!): [ID!]!
    myNotes: [Note!]!
  }

  input NoteInput {
    textContent: String
    codeBlocks: [CodeBlockInput]
    drawingData: String
    type: String
  }

  input CodeBlockInput {
    language: String!
    code: String!
  }

  extend type Mutation {
    upsertNote(taskId: ID, projectId: ID, eventId: ID, input: NoteInput!): Note!
    deleteNote(taskId: ID!): DeleteResponse!
  }
`;
