import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.routes";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import mongoose from "mongoose";
import passport from "./utils/passport";
import session from "express-session";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL as string,
      process.env.BACKEND_URL as string,
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (_req: Request, res: Response) => {
  res.send("Project Management System Backend is running");
});
app.use("/auth", authRoutes);
app.use("/chats", chatRoutes);

async function start() {
  try {
    const uri = process.env.MONGO_URI as string;
    await mongoose.connect(uri);
    console.log("Mongo connected");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Failed to start", err);
    process.exit(1);
  }
}
start();