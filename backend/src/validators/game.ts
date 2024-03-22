import { body } from "express-validator";

export const requireBoard = body("board.*")
  .trim()
  .isInt({ allow_leading_zeroes: false, min: 0, max: 2 });

export const requireCategory = body("categoryId")
  .trim()
  .isInt({ allow_leading_zeroes: false, min: 0, max: 9 });

export const requireFirst = body("first")
  .trim()
  .isInt({ allow_leading_zeroes: false, min: 0, max: 1 });

export const requireLevel = body("level")
  .trim()
  .isInt({ allow_leading_zeroes: false, min: 0, max: 1 });

export const requireImageComputer = body("computerImage")
  .trim()
  .isInt({ allow_leading_zeroes: false, min: 0, max: 19 });

export const requireImageUser = body("userImage")
  .trim()
  .isInt({ allow_leading_zeroes: false, min: 0, max: 19 });

export const requireResult = body("result")
  .trim()
  .isInt({ allow_leading_zeroes: false, min: 0, max: 3 });

export const requireWinners = body("winners.*")
  .trim()
  .isInt({ allow_leading_zeroes: false, min: 0, max: 8 });
