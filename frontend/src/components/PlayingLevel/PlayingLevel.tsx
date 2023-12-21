import React, { FC, memo, useContext } from "react";
import { changeLevel } from "../../actions/game";
import { Action } from "../../actions/types";
import {
  DictionaryContext,
  DictionaryEntry,
} from "../../contexts/dictionary/DictionaryContext";
import { GameContext } from "../../contexts/game/GameContext";
import { PlayingLevel as Level } from "../../types";
import "./PlayingLevel.scss";

interface Props {
  disabled: boolean;
  dispatch: React.Dispatch<Action>;
  dictionary: DictionaryEntry;
}

const MemoizedPlayingLevel: FC<Props> = memo(
  ({ disabled, dispatch, dictionary }) => {
    return (
      <div
        className="level"
        data-testid="level"
        title={dictionary.PLAYING_LEVEL_TOOLTIP}
      >
        <label htmlFor="level">{dictionary.PLAYING_LEVEL_LABEL}:</label>
        <select
          defaultValue={Level.Easy}
          id="level"
          onChange={(e) => {
            dispatch(changeLevel(+e.target.value * 1));
          }}
          disabled={disabled}
        >
          <option key="easy" value={Level.Easy}>
            {dictionary.PLAYING_LEVEL_EASY}
          </option>
          <option key="smart" value={Level.Smart}>
            {dictionary.PLAYING_LEVEL_SMART}
          </option>
        </select>
      </div>
    );
  }
);

const PlayingLevel: FC = () => {
  const { dictionary } = useContext(DictionaryContext);
  const { game, dispatch } = useContext(GameContext);

  return (
    <MemoizedPlayingLevel
      disabled={game.disabled}
      dispatch={dispatch}
      dictionary={dictionary}
    />
  );
};

export default PlayingLevel;
