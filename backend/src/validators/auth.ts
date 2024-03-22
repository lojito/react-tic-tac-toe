import { body } from "express-validator";
import User from "../models/user";

export const requireEmail = body("email")
  .isEmail()
  .withMessage("Please enter a valid email.")
  .custom(async (value) => {
    const userDoc = await User.findOne({ email: value });
    if (userDoc) {
      throw Error("E-Mail address already exists!");
    }
  })
  .normalizeEmail();

export const requireName = body("name").trim().not().isEmpty();

export const requirePassword = body("password").trim().isLength({ min: 5 });
