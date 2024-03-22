import { validationResult } from "express-validator";
import { ResponseError } from "../interfaces/error";
import Game from "../models/game";
import User from "../models/user";
import { DBGame } from "../types";

export const getGames = async (userId: string) => {
  try {
    const games = await Game.find({ user: userId }).sort({
      createdAt: -1,
    });
    return games;
  } catch (err) {
    return err;
  }
};

export const getGame = async (gameId: string, userId: string) => {
  try {
    const game = await Game.findById(gameId);
    if (!game) {
      return new Error(`Couldn't find game with id=${gameId} in the database.`);
    }

    if (game.user.toString() !== userId) {
      return new Error("Not autorized!");
    }

    return game;
  } catch (err) {
    return err;
  }
};

export const createGame = async (gameInfo: DBGame, userId: string) => {
  const {
    board,
    categoryId,
    first,
    computerImage,
    userImage,
    level,
    result,
    winners,
  } = gameInfo;

  try {
    const errors = validationResult(gameInfo);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.") as ResponseError;
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const game = await Game.create({
      board,
      categoryId,
      first,
      computerImage,
      userImage,
      level,
      result,
      winners,
      user: userId,
    });

    const user = await User.findById(userId);
    if (user) {
      user.games.push(game);
      await user.save();
      return game;
    }
  } catch (err: any) {
    return err;
  }
};

export const deleteGame = async (gameId: string, userId: string) => {
  try {
    const game = await Game.findById(gameId);

    if (!game) {
      throw new Error(`Couldn't find game with id=${gameId} in the database.`);
    }

    if (game.user.toString() !== userId) {
      throw new Error(
        `You are not authorized to delete the game with id=${gameId} from the database.`
      );
    }

    await Game.findByIdAndRemove(gameId);

    const user = await User.findById(userId);
    const index = user!.games.findIndex((game) => game.toString() === gameId);
    if (index !== -1) {
      user!.games.splice(index, 1);
      user!.save();
    }

    return game;
  } catch (err: any) {
    return err;
  }
};
