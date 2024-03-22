import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import { config } from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import http from "http";
import mongoose from "mongoose";
import { ResponseError } from "./interfaces/error";
import { isAuth } from "./middleware/is-auth";
import authRoutes from "./routes/auth";
import { resolvers, typeDefs } from "./schema";

interface MyContext {
  token?: String;
}

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use(isAuth);
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  const status = (error as ResponseError).statusCode || 500;
  const message = error.message;
  const data = (error as ResponseError).data;
  res.status(status).json({ message: message, data: data });
});

const httpServer = http.createServer(app);

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

async function run() {
  try {
    await server.start();

    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: async ({ req }) => ({ req }),
      })
    );

    config();

    mongoose.set("strictQuery", false);
    mongoose
      .connect(process.env.MONGO_URI!)
      .then(async () => {
        console.log("Connected to the database.");

        await new Promise<void>((resolve) =>
          httpServer.listen({ port: process.env.PORT }, resolve)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
}

run();
