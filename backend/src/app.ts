require("dotenv").config();

import path from "path";
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth";
import gameRoutes from "./routes/games";
import { ResponseError } from "./interfaces/error";

const app = express();

app.use(express.json());
app.use(cors());
console.log(path.join(__dirname, "data"));

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  const status = (error as ResponseError).statusCode || 500;
  const message = error.message;
  const data = (error as ResponseError).data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("connected to database");

    app.listen(process.env.PORT, () => {
      console.log("listening for requests on port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
