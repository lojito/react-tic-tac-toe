import React, { FC, useContext } from "react";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import { FirstPlayer, Player } from "../../types";
import "./StartGame.scss";

interface Props {
  first: FirstPlayer;
}

const Historical: FC<Props> = ({ first }) => {
  const {
    dictionary: {
      GAME_STARTED_BY,
      GAME_STARTED_BY_COMPUTER,
      GAME_STARTED_BY_YOU,
    },
  } = useContext(DictionaryContext);

  return (
    <div className="start" data-testid="start">
      {GAME_STARTED_BY}:{" "}
      {first === Player.Computer
        ? GAME_STARTED_BY_COMPUTER
        : GAME_STARTED_BY_YOU}
    </div>
  );
};

export default Historical;
