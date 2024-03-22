import React, { FC, useContext } from "react";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import { PlayingLevel } from "../../types";
import "./PlayingLevel.scss";

interface Props {
  level: PlayingLevel;
}

const Historical: FC<Props> = ({ level }) => {
  const {
    dictionary: {
      PLAYING_LEVEL_LABEL,
      PLAYING_LEVEL_EASY,
      PLAYING_LEVEL_SMART,
    },
  } = useContext(DictionaryContext);

  return (
    <div className="level" data-testid="level">
      <div>
        {PLAYING_LEVEL_LABEL}:{" "}
        {level === PlayingLevel.Easy ? PLAYING_LEVEL_EASY : PLAYING_LEVEL_SMART}
      </div>
    </div>
  );
};

export default Historical;
