import { ValidationError } from "express-validator";

export interface ResponseError extends Error {
  statusCode?: number;
  data?: ValidationError[];
}
