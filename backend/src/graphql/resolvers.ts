import { userQueries, userMutations } from './user';
import { projectQueries, projectMutations } from './project';
import { taskQueries, taskMutations, taskFieldResolvers } from './task';
import { noteQueries, noteMutations } from './note';

export const resolvers = {
    Query: {
        _empty: () => '',
        ...userQueries,
        ...projectQueries,
        ...taskQueries,
        ...noteQueries,
    },
    Mutation: {
        _empty: () => '',
        ...userMutations,
        ...projectMutations,
        ...taskMutations,
        ...noteMutations,
    },
    ...taskFieldResolvers,
};
