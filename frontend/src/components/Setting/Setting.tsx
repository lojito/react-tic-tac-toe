import React, { FC, memo, useContext } from "react";
import { Action, FirstAction, PlayingLevelAction } from "../../actions/types";
import { GameContext } from "../../contexts/game/GameContext";
import { Player, PlayingLevel } from "../../types";
import "./Setting.scss";

interface Option {
  value: Player | PlayingLevel;
  text: string;
}

interface SettingProps {
  tooltip: string;
  label: string;
  defaultValue: Player | PlayingLevel;
  changeAction: (setting: number) => FirstAction | PlayingLevelAction;
  testid: string;
  options: Option[];
}

interface Props extends SettingProps {
  disabled: boolean;
  dispatch: React.Dispatch<Action>;
}

const MemoizedSetting: FC<Props> = memo(
  ({
    disabled,
    dispatch,
    tooltip,
    label,
    defaultValue,
    testid,
    changeAction,
    options,
  }) => {
    const optionsJSX = options.map(({ value, text }: Option) => {
      return (
        <option key={text} value={value}>
          {text}
        </option>
      );
    });
    return (
      <div className="setting" title={tooltip} data-testid={testid}>
        <label htmlFor="setting">{label}?</label>
        <select
          defaultValue={defaultValue}
          id="setting"
          onChange={(e) => {
            dispatch(changeAction(+e.target.value));
          }}
          disabled={disabled}
        >
          {optionsJSX}
        </select>
      </div>
    );
  }
);

const Setting: FC<SettingProps> = ({
  tooltip,
  label,
  defaultValue,
  changeAction,
  testid,
  options,
}) => {
  const { game, dispatch } = useContext(GameContext);

  return (
    <MemoizedSetting
      disabled={game.disabled}
      dispatch={dispatch}
      tooltip={tooltip}
      label={label}
      defaultValue={defaultValue}
      testid={testid}
      changeAction={changeAction}
      options={options}
    />
  );
};

export default Setting;
