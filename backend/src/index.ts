import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.routes";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import mongoose from "mongoose";
import passport from "./utils/passport";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers, createContext, GraphQLContext } from "./graphql";

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
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

app.use(passport.initialize());

app.get("/", (_req: Request, res: Response) => {
  res.send("Project Management System Backend is running with GraphQL");
});

// Keep REST routes for auth (needed for Google OAuth callback)
app.use("/auth", authRoutes);
app.use("/chats", chatRoutes);

async function start() {
  try {
    const uri = process.env.MONGO_URI as string;
    await mongoose.connect(uri);
    console.log("Mongo connected");

    // Create Apollo Server
    const server = new ApolloServer<GraphQLContext>({
      typeDefs,
      resolvers,
    });

    // Start Apollo Server
    await server.start();
    console.log("Apollo Server started");

    // Apply Apollo middleware to Express
    app.use(
      "/graphql",
      cors<cors.CorsRequest>({
        origin: [
          process.env.FRONTEND_URL as string,
          process.env.BACKEND_URL as string,
          "https://taskify-event.vercel.app",
          "http://taskify-event.vercel.app"
        ],
        credentials: true,
      }),
      express.json(),
      expressMiddleware(server, {
        context: async ({ req, res }): Promise<GraphQLContext> => {
          return createContext({
            req: req as unknown as Request,
            res: res as unknown as Response
          });
        },
      }) as unknown as express.RequestHandler
    );

    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  } catch (err) {
    console.error("Failed to start", err);
    process.exit(1);
  }
}
start();
