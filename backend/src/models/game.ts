import mongoose from "mongoose";
import { IGame } from "../interfaces/game";

const Schema = mongoose.Schema;

const gameSchema = new Schema<IGame>(
  {
    board: [
      {
        type: Number,
        required: true,
      },
    ],
    categoryId: {
      type: Number,
      required: true,
    },
    first: {
      type: Number,
      required: true,
    },
    computerImage: {
      type: Number,
      required: true,
    },
    userImage: {
      type: Number,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    result: {
      type: Number,
      required: true,
    },
    winners: [
      {
        type: Number,
        required: true,
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IGame>("Game", gameSchema);
