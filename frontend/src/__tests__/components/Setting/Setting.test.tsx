import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Setting from "../../../components/Setting/Setting";
import { GameContext, State } from "../../../contexts/game/GameContext";
import { PlayingLevel as Level, Player } from "../../../types";

describe("Setting", () => {
  const mockDictionary = {
    PLAYING_LEVEL_LABEL: "Level",
    PLAYING_LEVEL_EASY: "Easy",
    PLAYING_LEVEL_SMART: "Smart",
    PLAYING_LEVEL_TOOLTIP:
      "How much thinking the computer does before playing.",
    START_GAME_LABEL: "Who plays first",
    START_GAME_TOOLTIP: "Who starts playing the game: You or the computer?",
    START_GAME_ANSWER_YES: "Yes",
    START_GAME_ANSWER_NO: "No",
  };

  let tooltip: string;
  let label: string;
  let testid: string;
  let option1Text: string;
  let option1Value: Level | Player;
  let option2Text: string;
  let option2Value: Level | Player;

  interface Props {
    disabled?: boolean;
    renderPlayingLevel?: boolean;
  }

  const renderSetting = ({
    disabled = false,
    renderPlayingLevel = true,
  }: Props = {}) => {
    if (renderPlayingLevel) {
      tooltip = mockDictionary.PLAYING_LEVEL_TOOLTIP!;
      label = mockDictionary.PLAYING_LEVEL_LABEL!;
      testid = "level";
      option1Text = mockDictionary.PLAYING_LEVEL_EASY!;
      option1Value = Level.Easy;
      option2Text = mockDictionary.PLAYING_LEVEL_SMART!;
      option2Value = Level.Smart;
    } else {
      tooltip = mockDictionary.START_GAME_TOOLTIP!;
      label = mockDictionary.START_GAME_LABEL!;
      testid = "startgame";
      option1Text = mockDictionary.START_GAME_ANSWER_YES!;
      option1Value = Player.User;
      option2Text = mockDictionary.START_GAME_ANSWER_NO!;
      option2Value = Player.Computer;
    }

    const game = {
      level: option1Value,
      disabled,
    } as State;

    const dispatch = jest.fn();
    const changeAction = jest.fn();

    const utils = render(
      <GameContext.Provider value={{ game, dispatch }}>
        <Setting
          tooltip={tooltip}
          label={label}
          defaultValue={option1Value}
          changeAction={changeAction}
          testid={testid}
          options={[
            {
              value: option1Value,
              text: option1Text,
            },
            {
              value: option2Value,
              text: option2Text,
            },
          ]}
        />
      </GameContext.Provider>
    );

    const divWrapper = screen.getByTestId(testid);

    const select = screen.getByRole("combobox");

    const options = screen.getAllByRole("option");

    const option1 = screen.getByRole("option", {
      name: option1Text,
    }) as HTMLOptionElement;

    const option2 = screen.getByRole("option", {
      name: option2Text,
    }) as HTMLOptionElement;

    return {
      ...utils,
      mockDictionary,
      dispatch,
      divWrapper,
      select,
      options,
      option1,
      option1Value,
      option2,
      option2Value,
    };
  };

  it("should render correctly", () => {
    const { asFragment } = renderSetting();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should render correctly as a StartGame component", () => {
    const { asFragment } = renderSetting({ renderPlayingLevel: false });

    expect(asFragment()).toMatchSnapshot();
  });

  it("should display the dropdown", () => {
    const { select } = renderSetting();

    expect(select).toBeInTheDocument();
  });

  it("should apply the 'setting' class", () => {
    const { divWrapper } = renderSetting();

    expect(divWrapper).toHaveClass("setting");
  });

  it("should correctly set default option", () => {
    const { option1 } = renderSetting();

    expect(option1.selected).toBeTruthy();
  });

  it("should display the correct number of options", () => {
    const { options } = renderSetting();

    expect(options).toHaveLength(2);
  });

  it("should allow user to change the dropdown default option and call the dispatch function when disabled is false", async () => {
    const user = userEvent.setup();
    const { dispatch, select, option1, option2, option1Value, option2Value } =
      renderSetting();

    expect(select).toHaveValue(option1Value + "");
    expect(option1.selected).toBeTruthy();
    expect(option2.selected).toBeFalsy();

    await user.selectOptions(select, option2);

    expect(select).toHaveValue(option2Value + "");
    expect(option1.selected).toBeFalsy();
    expect(option2.selected).toBeTruthy();
    expect(dispatch).toBeCalled();
  });

  it("should not allow the user to change the dropdown default option nor call the dispatch function when disabled is true", () => {
    const user = userEvent.setup();
    const { dispatch, select, option2, option1Value } = renderSetting({
      disabled: true,
    });

    expect(select).toHaveValue(option1Value + "");

    user.selectOptions(select, option2);

    expect(select).toHaveValue(option1Value + "");
    expect(dispatch).not.toBeCalled();
  });
});
