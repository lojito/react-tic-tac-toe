import { useCallback, useEffect, useRef, useState } from "react";
import Board from "../../classes/Board";
import Computer from "../../classes/Computer";
import {
  Categories,
  DBGame,
  FirstPlayer,
  GameResult,
  ImageName,
  Player,
  PlayingLevel,
  SquareLocation,
} from "../../types";

interface Props {
  disabled: boolean;
  first: FirstPlayer;
  level: PlayingLevel;
  userImage: ImageName;
  computerImage: ImageName;
  category: Categories;
}

function useBoard(
  {
    disabled,
    first,
    level,
    userImage,
    computerImage,
    category: { id: categoryId },
  }: Props,
  onGameOver: (game: DBGame) => void
) {
  const board = useRef(Board);
  const computer = useRef(Computer);
  const gameOver = useRef(false);
  const player = useRef(Player.Nobody);
  const result = useRef(GameResult.Started);
  const winners = useRef<SquareLocation[]>([]);
  board.current.first = first;
  board.current.level = level;
  const [gameBoard, setGameBoard] = useState(board.current.getBoard());

  const playGame = useCallback((square?: SquareLocation) => {
    if (player.current === Player.Computer) {
      computer.current.play();
    } else {
      board.current.place(Player.User, square!);
    }
    setGameBoard(board.current.getBoard());

    winners.current = board.current.isAWinner(player.current);
    if (winners.current.length) {
      gameOver.current = true;
      result.current =
        player.current === Player.Computer ? GameResult.Lost : GameResult.Won;
    } else if (board.current.isFull) {
      gameOver.current = true;
      result.current = GameResult.Draw;
    } else {
      player.current =
        player.current === Player.Computer ? Player.User : Player.Computer;
      if (player.current === Player.Computer) {
        playGame();
      }
    }
  }, []);

  const resetGame = useCallback(() => {
    board.current.reset();
    gameOver.current = false;
    player.current = Player.Nobody;
    result.current = GameResult.Started;
    winners.current = [];
    setGameBoard(board.current.getBoard());
  }, []);

  useEffect(() => {
    if (!disabled && !gameOver.current) {
      resetGame();
    }
  }, [disabled, resetGame]);

  useEffect(() => {
    if (disabled === false) {
      if (first === Player.Computer) {
        player.current = Player.Computer;
      } else {
        player.current = Player.User;
      }
    } else {
      if (player.current === Player.Computer) {
        playGame();
      }
    }
  }, [disabled, first, playGame]);

  useEffect(() => {
    if (gameOver.current) {
      onGameOver({
        board: gameBoard,
        categoryId,
        first,
        userImage: userImage,
        computerImage: computerImage,
        level,
        result: result.current,
        winners: winners.current,
      });
      gameOver.current = false;
    }
  });

  return {
    playGame,
    gameBoard,
  };
}

export default useBoard;
