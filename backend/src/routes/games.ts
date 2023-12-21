import { Router } from "express";
import { is_auth as isAuth } from "../middleware/is-auth";
import {
  requireBoard,
  requireCategory,
  requireFirst,
  requireImageComputer,
  requireImageUser,
  requireLevel,
  requireResult,
  requireWinners,
} from "../validators/game";
import { getGames, getGame, createGame, deleteGame } from "../controllers/game";

const router = Router();

// GET all games
router.get("/", isAuth, getGames);

// GET a single game
router.get("/:id", isAuth, getGame);

// POST a new game
router.post(
  "/",
  isAuth,
  [
    requireBoard,
    requireCategory,
    requireFirst,
    requireImageComputer,
    requireImageUser,
    requireLevel,
    requireResult,
    requireWinners,
  ],
  createGame
);

// DELETE a game
router.delete("/:id", isAuth, deleteGame);

export default router;
