import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email?: string, name?: string};
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const cookieToken = req.cookies?.[process.env.COOKIE_NAME || "token"];
    const authHeader = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : undefined;
    const token = cookieToken || authHeader;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const payload = verifyJwt<{ id: string; email?: string; name?: string }>(token);
    req.user = { id: payload.id, email: payload.email, name: payload.name };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
