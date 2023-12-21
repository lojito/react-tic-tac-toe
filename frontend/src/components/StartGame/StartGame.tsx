import React, { FC, memo, useContext } from "react";
import { changeFirst } from "../../actions/game";
import { Action } from "../../actions/types";
import {
  DictionaryContext,
  DictionaryEntry,
} from "../../contexts/dictionary/DictionaryContext";
import { GameContext } from "../../contexts/game/GameContext";
import { Player } from "../../types";
import "./StartGame.scss";

interface Props {
  disabled: boolean;
  dispatch: React.Dispatch<Action>;
  dictionary: DictionaryEntry;
}

const MemoizedStartGame: FC<Props> = memo(
  ({ disabled, dispatch, dictionary }) => {
    return (
      <div
        className="start"
        data-testid="startgame"
        title={dictionary.YOU_START_TOOLTIP}
      >
        <label htmlFor="start">{dictionary.YOU_START_LABEL}:</label>
        <select
          defaultValue={Player.User}
          id="start"
          onChange={(e) => {
            dispatch(changeFirst(+e.target.value));
          }}
          disabled={disabled}
        >
          <option key="user" value={Player.User}>
            {dictionary.YOU_START_YES}
          </option>
          <option key="computer" value={Player.Computer}>
            {dictionary.YOU_START_NO}
          </option>
        </select>
      </div>
    );
  }
);

const StartGame: FC = () => {
  const { dictionary } = useContext(DictionaryContext);
  const { game, dispatch } = useContext(GameContext);

  return (
    <MemoizedStartGame
      disabled={game.disabled}
      dispatch={dispatch}
      dictionary={dictionary}
    />
  );
};

export default StartGame;
