import { gql } from '@apollo/client';

export const UPSERT_NOTE = gql`
  mutation UpsertNote($id: ID, $taskId: ID, $projectId: ID, $eventId: ID, $input: NoteInput!) {
    upsertNote(id: $id, taskId: $taskId, projectId: $projectId, eventId: $eventId, input: $input) {
      id
      taskId
      projectId
      eventId
      userId
      title
      description
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
  mutation DeleteNote($id: ID, $taskId: ID) {
    deleteNote(id: $id, taskId: $taskId) {
      message
      success
    }
  }
`;
