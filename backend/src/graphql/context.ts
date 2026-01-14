import { Request, Response } from 'express';
import { verifyJwt } from '../utils/jwt';

export interface GraphQLContext {
    user: { id: string; email: string; name?: string } | null;
    req: Request;
    res: Response;
}

export async function createContext({ req, res }: { req: Request; res: Response }): Promise<GraphQLContext> {
    const token = req.cookies?.token;

    if (!token) {
        return { user: null, req, res };
    }

    try {
        const decoded = verifyJwt<{ id: string; email: string; name?: string }>(token);
        return { user: decoded, req, res };
    } catch {
        return { user: null, req, res };
    }
}
