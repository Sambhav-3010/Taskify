export const noteInputs = `
  input CodeBlockInput {
    language: String!
    code: String!
  }

  input NoteInput {
    title: String
    description: String
    textContent: String
    codeBlocks: [CodeBlockInput!]
    drawingData: String
    type: String
  }
`;
