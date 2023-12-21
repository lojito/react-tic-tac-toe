import React, { FC, useContext } from "react";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import { FirstPlayer, Player } from "../../types";
import "./StartGame.scss";

interface Props {
  first: FirstPlayer;
}

const Historical: FC<Props> = ({ first }) => {
  const { dictionary } = useContext(DictionaryContext);

  return (
    <div className="start" data-testid="start">
      {dictionary.GAME_STARTED_BY}:{" "}
      {first === Player.Computer
        ? dictionary.GAME_STARTED_BY_COMPUTER
        : dictionary.GAME_STARTED_BY_YOU}
    </div>
  );
};

export default Historical;
