import React, { FC, useContext } from "react";
import { changeFirst } from "../../actions/game";
import Setting from "../../components/Setting/Setting";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import { Player } from "../../types";

const StartGame: FC = () => {
  const {
    dictionary: {
      START_GAME_TOOLTIP,
      START_GAME_LABEL,
      START_GAME_ANSWER_YES,
      START_GAME_ANSWER_NO,
    },
  } = useContext(DictionaryContext);

  return (
    <Setting
      tooltip={START_GAME_TOOLTIP!}
      label={START_GAME_LABEL!}
      defaultValue={Player.User}
      changeAction={changeFirst}
      testid="startgame"
      options={[
        {
          value: Player.User,
          text: START_GAME_ANSWER_YES!,
        },
        {
          value: Player.Computer,
          text: START_GAME_ANSWER_NO!,
        },
      ]}
    />
  );
};

export default StartGame;
