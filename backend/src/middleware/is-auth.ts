import { config } from "dotenv";
import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { ResponseError } from "../interfaces/error";

export const isAuth: RequestHandler = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.") as ResponseError;
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];

  try {
    config();

    const decodedToken = verify(token, process.env.secret!) as JwtPayload;
    if (!decodedToken) {
      const error = new Error("Not authenticated.") as ResponseError;
      error.statusCode = 401;
      throw error;
    }

    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    (err as ResponseError).statusCode = 500;
    throw err;
  }
};
