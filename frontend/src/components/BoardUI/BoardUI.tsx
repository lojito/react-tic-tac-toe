import React, { FC, memo, useContext } from "react";
import { GameContext } from "../../contexts/game/GameContext";
import useBoard from "../../hooks/game/useBoard";
import {
  DBGame,
  GameBoard,
  ImageFolder,
  ImageName,
  Player,
  SquareLocation,
} from "../../types";
import Square from "../Square/Square";
import "./BoardUI.scss";

interface MemoizedBoardProps {
  playGame: (id?: SquareLocation | undefined) => void;
  disabled: boolean;
  board: GameBoard;
  folder: ImageFolder;
  userImage: ImageName;
  computerImage: ImageName;
  over: boolean;
  winners: SquareLocation[];
}

const MemoizedBoard: FC<MemoizedBoardProps> = memo(
  ({
    disabled,
    board,
    folder,
    userImage,
    computerImage,
    over,
    winners,
    playGame,
  }) => {
    const squares = board.map((player: Player, square: SquareLocation) => {
      const imagePath =
        player === Player.Computer
          ? `${folder}/${computerImage}`
          : player === Player.User
          ? `${folder}/${userImage}`
          : "default";
      const isDisabled = !disabled || over || player !== Player.Nobody;
      const className = over
        ? winners.indexOf(square) !== -1
          ? "win"
          : ""
        : "";

      return (
        <Square
          disabled={isDisabled}
          id={square + ""}
          imagePath={imagePath}
          key={`square-${square}`}
          className={className}
        />
      );
    });

    return (
      <div
        className="board"
        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          playGame(+(e.target as HTMLDivElement).id);
        }}
        data-testid="board"
      >
        {squares}
      </div>
    );
  }
);

interface Props {
  onGameOver: (game: DBGame) => void;
}

const BoardUI: FC<Props> = ({ onGameOver }) => {
  const { game } = useContext(GameContext);
  const { category, disabled, userImage, computerImage, over, winners } = game;
  const { folder } = category;

  const { playGame, gameBoard: board } = useBoard(game, onGameOver);

  return (
    <MemoizedBoard
      disabled={disabled}
      board={board}
      folder={folder}
      userImage={userImage}
      computerImage={computerImage}
      over={over}
      winners={winners}
      playGame={playGame}
    />
  );
};

export default BoardUI;
