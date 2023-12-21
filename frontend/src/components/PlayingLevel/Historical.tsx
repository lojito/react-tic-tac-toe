import React, { FC, useContext } from "react";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import { PlayingLevel } from "../../types";
import "./PlayingLevel.scss";

interface Props {
  level: PlayingLevel;
}

const Historical: FC<Props> = ({ level }) => {
  const { dictionary } = useContext(DictionaryContext);

  return (
    <div className="level" data-testid="level">
      <div>
        {dictionary.PLAYING_LEVEL_LABEL}:{" "}
        {level === PlayingLevel.Easy
          ? dictionary.PLAYING_LEVEL_EASY
          : dictionary.PLAYING_LEVEL_SMART}
      </div>
    </div>
  );
};

export default Historical;
