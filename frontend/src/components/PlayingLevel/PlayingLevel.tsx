import React, { FC, useContext } from "react";
import { changeLevel } from "../../actions/game";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import Setting from "../../components/Setting/Setting";
import { PlayingLevel as Level } from "../../types";

const PlayingLevel: FC = () => {
  const {
    dictionary: {
      PLAYING_LEVEL_TOOLTIP,
      PLAYING_LEVEL_LABEL,
      PLAYING_LEVEL_EASY,
      PLAYING_LEVEL_SMART,
    },
  } = useContext(DictionaryContext);

  return (
    <Setting
      tooltip={PLAYING_LEVEL_TOOLTIP!}
      label={PLAYING_LEVEL_LABEL!}
      defaultValue={Level.Easy}
      changeAction={changeLevel}
      testid="level"
      options={[
        {
          value: Level.Easy,
          text: PLAYING_LEVEL_EASY!,
        },
        {
          value: Level.Smart,
          text: PLAYING_LEVEL_SMART!,
        },
      ]}
    />
  );
};

export default PlayingLevel;
