import { userQueries, userMutations } from './user';
import { projectQueries, projectMutations } from './project';
import { taskQueries, taskMutations, taskFieldResolvers } from './task';

export const resolvers = {
    Query: {
        _empty: () => '',
        ...userQueries,
        ...projectQueries,
        ...taskQueries,
    },
    Mutation: {
        _empty: () => '',
        ...userMutations,
        ...projectMutations,
        ...taskMutations,
    },
    ...taskFieldResolvers,
};
