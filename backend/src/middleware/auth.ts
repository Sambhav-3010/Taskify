import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import { Types } from "mongoose";
import User, { IUser } from "../models/User";

declare global {
  namespace Express {
    interface User extends IUser {}
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
    if (!payload.id) {
        return res.status(401).json({ message: "Invalid token payload" });
    }

    // Fetch the full user from the database to ensure req.user is of type IUser
    User.findById(payload.id).then(user => {
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user; // Assign the full IUser document
        next();
    }).catch(err => {
        console.error("Error fetching user in auth middleware:", err);
        return res.status(500).json({ message: "Internal server error" });
    });

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
