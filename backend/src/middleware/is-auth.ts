const jwt = require("jsonwebtoken");
import { RequestHandler } from "express";
import { ResponseError } from "../interfaces/error";

export const is_auth: RequestHandler = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.") as ResponseError;
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, "somesupersecretsecret");
  } catch (err) {
    (err as ResponseError).statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    const error = new Error("Not authenticated.") as ResponseError;
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
