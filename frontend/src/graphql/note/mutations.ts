import { gql } from '@apollo/client';

export const UPSERT_NOTE = gql`
  mutation UpsertNote($taskId: ID, $projectId: ID, $eventId: ID, $input: NoteInput!) {
    upsertNote(taskId: $taskId, projectId: $projectId, eventId: $eventId, input: $input) {
      id
      taskId
      projectId
      eventId
      userId
      textContent
      codeBlocks {
        language
        code
      }
      drawingData
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation DeleteNote($taskId: ID!) {
    deleteNote(taskId: $taskId) {
      message
      success
    }
  }
`;
