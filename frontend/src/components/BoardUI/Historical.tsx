import React, { FC, memo } from "react";
import {
  GameBoard,
  ImageFolder,
  ImageName,
  Player,
  SquareLocation,
} from "../../types";
import Square from "../Square/Historical";
import "./BoardUI.scss";

interface Props {
  folder: ImageFolder;
  computerImage: ImageName;
  userImage: ImageName;
  board: GameBoard;
  winners: SquareLocation[];
}

const Historical: FC<Props> = ({
  folder,
  userImage,
  computerImage,
  board,
  winners,
}) => {
  const boardJSX = board.map((player: Player, square: SquareLocation) => {
    const imagePath =
      player === Player.Computer
        ? `${folder}/${computerImage}`
        : player === Player.User
        ? `${folder}/${userImage}`
        : "default";
    const className = winners.indexOf(square) !== -1 ? "win" : "";

    return (
      <Square
        disabled
        id={square + ""}
        imagePath={imagePath}
        key={`square-${square}`}
        className={className}
      />
    );
  });

  return <div className="board">{boardJSX}</div>;
};

export default memo(Historical);
