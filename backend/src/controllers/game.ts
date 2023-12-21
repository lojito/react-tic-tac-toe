import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import Game from "../models/game";
import User from "../models/user";
import errorHandler from "../middleware/error";
import { ResponseError } from "../interfaces/error";

export const getGames: RequestHandler = async (req, res, next) => {
  try {
    const games = await Game.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(games);
  } catch (err) {
    errorHandler(err, next);
  }
};

export const getGame: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  const { id } = req.params;

  try {
    const game = await Game.findById(id);

    if (!game) {
      return res.status(404).json({ error: "No such game" });
    }

    if (game.user.toString() !== req.userId!.toString()) {
      const error = new Error("Not autorized!") as ResponseError;
      error.statusCode = 403;
      throw error;
    }

    res.status(200).json(game);
  } catch (err) {
    errorHandler(err, next);
  }
};

export const createGame: RequestHandler = async (req, res, next) => {
  const {
    board,
    categoryId,
    first,
    computerImage,
    userImage,
    level,
    result,
    winners,
  } = req.body;

  try {
    const errors = validationResult(req);
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
      user: req.userId,
    });

    const user = await User.findById(req.userId);
    if (user) {
      user.games.push(game);

      await user.save();

      res.status(201).json({
        message: "Game created",
        game,
        user: { _id: user._id, name: user.name },
      });
    }
  } catch (err: any) {
    errorHandler(err, next);
  }
};

export const deleteGame: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  const { id } = req.params;
  try {
    const game = await Game.findById(id);

    if (!game) {
      return res.status(400).json({ error: "No such game" });
    }

    if (game.user.toString() !== req.userId!.toString()) {
      const error = new Error("Not autorized!") as ResponseError;
      error.statusCode = 403;
      throw error;
    }

    await Game.findByIdAndRemove(id);

    const user = await User.findById(req.userId);
    const index = user!.games.findIndex((game) => game.toString() === id);
    if (index !== -1) {
      user!.games.splice(index, 1);
      user!.save();
    }

    res.status(200).json(game);
  } catch (err: any) {
    errorHandler(err, next);
  }
};
