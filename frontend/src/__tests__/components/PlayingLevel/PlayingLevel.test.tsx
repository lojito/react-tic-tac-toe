import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayingLevel from "../../../components/PlayingLevel/PlayingLevel";
import {
  DictionaryContext,
  DictionaryEntry,
} from "../../../contexts/dictionary/DictionaryContext";
import { GameContext, State } from "../../../contexts/game/GameContext";
import { PlayingLevel as Level } from "../../../types";

jest.mock("../../../actions/game", () => {
  return {
    changeLevel: (level: Level) => {
      return {
        type: "CHANGE_PLAYING_LEVEL",
        level,
      };
    },
  };
});

describe("PlayingLevel", () => {
  const renderPlayingLevel = (disabled: boolean = false) => {
    const mockDictionary = {
      PLAYING_LEVEL_LABEL: "Level",
      PLAYING_LEVEL_EASY: "Easy",
      PLAYING_LEVEL_SMART: "Smart",
      PLAYING_LEVEL_TOOLTIP:
        "How much thinking the computer does before playing.",
    } as DictionaryEntry;

    const game = {
      level: Level.Easy,
      disabled,
    } as State;

    const dispatch = jest.fn();

    const utils = render(
      <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
        <GameContext.Provider value={{ game, dispatch }}>
          <PlayingLevel />
        </GameContext.Provider>
      </DictionaryContext.Provider>
    );

    const divWrapper = screen.getByTestId("level");

    const selectLevel = screen.getByRole("combobox");

    const options = screen.getAllByRole("option");

    const optionEasy = screen.getByRole("option", {
      name: mockDictionary.PLAYING_LEVEL_EASY,
    }) as HTMLOptionElement;

    const optionSmart = screen.getByRole("option", {
      name: mockDictionary.PLAYING_LEVEL_SMART,
    }) as HTMLOptionElement;

    return {
      ...utils,
      mockDictionary,
      dispatch,
      divWrapper,
      selectLevel,
      options,
      optionEasy,
      optionSmart,
    };
  };

  it("should render correctly", () => {
    const { asFragment } = renderPlayingLevel();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should display the PlayingLevel dropdown", () => {
    const { selectLevel } = renderPlayingLevel();

    expect(selectLevel).toBeInTheDocument();
  });

  it("should apply the 'level' class", () => {
    const { divWrapper } = renderPlayingLevel();

    expect(divWrapper).toHaveClass("level");
  });

  it("should correctly set default option", () => {
    const { optionEasy } = renderPlayingLevel();

    expect(optionEasy.selected).toBeTruthy();
  });

  it("should display the correct number of options", () => {
    const { options } = renderPlayingLevel();

    expect(options).toHaveLength(2);
  });

  it("should allow user to change the computer playing level and call the dispatch function", () => {
    const { dispatch, selectLevel, optionEasy, optionSmart } =
      renderPlayingLevel();

    expect(selectLevel).toHaveValue(Level.Easy + "");
    expect(optionEasy.selected).toBeTruthy();
    expect(optionSmart.selected).toBeFalsy();

    userEvent.selectOptions(selectLevel, optionSmart);

    expect(selectLevel).toHaveValue(Level.Smart + "");
    expect(optionEasy.selected).toBeFalsy();
    expect(optionSmart.selected).toBeTruthy();

    expect(dispatch).toBeCalled();
  });

  it("should not allow the user to change the computer playing level nor call the dispatch function", () => {
    const disabled = true;
    const { dispatch, selectLevel, optionSmart } = renderPlayingLevel(disabled);

    expect(selectLevel).toHaveValue(Level.Easy + "");
    userEvent.selectOptions(selectLevel, optionSmart);

    expect(selectLevel).toHaveValue(Level.Easy + "");
    expect(dispatch).not.toBeCalled();
  });
});
