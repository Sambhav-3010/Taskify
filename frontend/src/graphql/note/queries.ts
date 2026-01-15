import { gql } from '@apollo/client';

export const GET_NOTE = gql`
  query GetNote($taskId: ID, $projectId: ID, $eventId: ID) {
    note(taskId: $taskId, projectId: $projectId, eventId: $eventId) {
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

export const GET_TASKS_WITH_NOTES = gql`
  query GetTasksWithNotes($taskIds: [ID!]!) {
    tasksWithNotes(taskIds: $taskIds)
  }
`;

export const GET_MY_NOTES = gql`
  query GetMyNotes {
    myNotes {
      id
      taskId
      projectId
      eventId
      textContent
      createdAt
      updatedAt
    }
  }
`;
