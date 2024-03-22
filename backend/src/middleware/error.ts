import { NextFunction } from "express";

const errorHandler = (err: any, next: NextFunction) => {
  if (typeof err === "object" && err !== null) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
  next(err);
};

export default errorHandler;
