import mongoose from "mongoose";
import { IUser } from "../interfaces/user";

const Schema = mongoose.Schema;

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  games: [
    {
      type: Schema.Types.ObjectId,
      ref: "Game",
    },
  ],
});

export default mongoose.model<IUser>("User", userSchema);
