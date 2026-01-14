import User from '../../models/User';
import { GraphQLContext } from '../context';

export const userQueries = {
    me: async (_: unknown, __: unknown, context: GraphQLContext) => {
        if (!context.user) {
            return null;
        }

        const user = await User.findById(context.user.id).select('-password');
        if (!user) {
            return null;
        }

        return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            createdAt: user.createdAt.toISOString(),
        };
    },
};
