import { gql } from "@apollo/client";

export const GET_TASKS = gql`
  query GetTasks($filter: TaskFilterInput, $page: Int, $limit: Int) {
    tasks(filter: $filter, page: $page, limit: $limit) {
      tasks {
        id
        title
        status
        priority
        deadline
        projectId
        project {
          id
          name
        }
        userId
      }
      totalPages
      currentPage
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      status
      priority
      deadline
      projectId
      project {
        id
        name
      }
      userId
    }
  }
`;
