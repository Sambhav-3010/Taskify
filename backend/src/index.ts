import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.routes";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import mongoose from "mongoose";
import passport from "./utils/passport";
import session from "express-session";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";
import eventRoutes from "./routes/event.routes";
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
      "https://taskify-event.vercel.app",
      "http://taskify-event.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(passport.initialize());

app.get("/", (_req: Request, res: Response) => {
  res.send("Project Management System Backend is running");
});
app.use("/auth", authRoutes);
app.use("/chats", chatRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/events", eventRoutes);

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
