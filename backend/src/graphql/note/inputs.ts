export const noteInputs = `
  input CodeBlockInput {
    language: String!
    code: String!
  }

  input NoteInput {
    textContent: String
    codeBlocks: [CodeBlockInput!]
    drawingData: String
  }
`;
