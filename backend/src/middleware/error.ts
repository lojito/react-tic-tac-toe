import { NextFunction } from "express";

export default (err: any, next: NextFunction) => {
  if (typeof err === "object" && err !== null) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
  next(err);
};
