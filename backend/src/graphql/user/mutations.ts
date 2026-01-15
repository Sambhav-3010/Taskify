import bcrypt from 'bcrypt';
import User from '../../models/User';
import { signJwt } from '../../utils/jwt';
import { GraphQLContext } from '../context';
import { COOKIE_NAME, getCookieOptions } from '../../utils/cookies';

interface SignupInput {
    email: string;
    password: string;
    name: string;
}

interface LoginInput {
    email: string;
    password: string;
}

export const userMutations = {
    signup: async (_: unknown, { input }: { input: SignupInput }, context: GraphQLContext) => {
        const { email, password, name } = input;

        const existing = await User.findOne({ email });
        if (existing) {
            throw new Error('Email already in use');
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashed, name });
        const token = signJwt({ id: user._id.toString(), email: user.email });

        // Set cookie
        context.res.cookie(COOKIE_NAME, token, getCookieOptions());

        return {
            message: 'User created',
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
            },
        };
    },

    login: async (_: unknown, { input }: { input: LoginInput }, context: GraphQLContext) => {
        const { email, password } = input;

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            throw new Error('Invalid credentials');
        }

        const token = signJwt({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
        });

        context.res.cookie(COOKIE_NAME, token, getCookieOptions());

        return {
            message: 'Login successful',
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
            },
        };
    },

    logout: async (_: unknown, __: unknown, context: GraphQLContext) => {
        const cookieOptions = getCookieOptions();
        context.res.clearCookie(COOKIE_NAME, {
            httpOnly: cookieOptions.httpOnly,
            sameSite: cookieOptions.sameSite,
            secure: cookieOptions.secure,
        });

        return {
            message: 'Logged out',
            user: null,
        };
    },
};
