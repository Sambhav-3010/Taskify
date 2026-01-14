export const userTypeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String
    createdAt: String!
  }

  type AuthPayload {
    message: String!
    user: User
  }

  extend type Query {
    me: User
  }

  extend type Mutation {
    signup(input: SignupInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    logout: AuthPayload!
  }
`;
