import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { signJwt } from "../utils/jwt";

const COOKIE_NAME = process.env.COOKIE_NAME || "token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 1000 * 60 * 60
};

export async function signup(req: Request, res: Response) {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email already in use" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, name });
  const token = signJwt({ id: user._id.toString(), email: user.email });

  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
  return res.status(201).json({ user: { id: user._id, email: user.email, name: user.name } });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signJwt({ id: user._id.toString(), email: user.email });
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
  return res.json({ user: { id: user._id, email: user.email, name: user.name } });
}

export async function logout(req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  return res.json({ message: "Logged out" });
}

export async function me(req: Request, res: Response) {
  if (!req.user?.id) return res.status(401).json({ message: "Not authenticated" });
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user });
}