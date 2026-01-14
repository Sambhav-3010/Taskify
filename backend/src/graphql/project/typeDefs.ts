export const projectTypeDefs = `#graphql
  type Project {
    id: ID!
    name: String!
    description: String!
    createdAt: String!
    userId: ID!
  }

  extend type Query {
    projects: [Project!]!
    project(id: ID!): Project
  }

  extend type Mutation {
    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project
    deleteProject(id: ID!): DeleteResponse!
  }

  type DeleteResponse {
    message: String!
    success: Boolean!
  }
`;
