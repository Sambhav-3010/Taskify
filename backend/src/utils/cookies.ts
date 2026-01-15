import { CookieOptions } from "express";

export const COOKIE_NAME = process.env.COOKIE_NAME || "token";

export const getCookieOptions = (): CookieOptions => {
    const isProduction = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    };
};
