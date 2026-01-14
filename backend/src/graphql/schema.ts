import { userTypeDefs, userInputs } from './user';
import { projectTypeDefs, projectInputs } from './project';
import { taskTypeDefs, taskInputs } from './task';

// Base schema with Query and Mutation types that will be extended
const baseTypeDefs = `#graphql
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [
    baseTypeDefs,
    userTypeDefs,
    userInputs,
    projectTypeDefs,
    projectInputs,
    taskTypeDefs,
    taskInputs,
];
