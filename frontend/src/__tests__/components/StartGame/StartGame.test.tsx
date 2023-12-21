import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StartGame from "../../../components/StartGame/StartGame";
import {
  DictionaryContext,
  DictionaryEntry,
} from "../../../contexts/dictionary/DictionaryContext";
import { GameContext, State } from "../../../contexts/game/GameContext";
import { FirstPlayer, Player } from "../../../types";

jest.mock("../../../actions/game", () => {
  return {
    changeFirst: (first: FirstPlayer) => {
      return {
        type: "CHANGE_FIRST",
        first,
      };
    },
  };
});

describe("StartGame", () => {
  const renderStartGame = (disabled: boolean = false) => {
    const mockDictionary = {
      YOU_START_LABEL: "Who plays first",
      YOU_START_TOOLTIP: "Who starts playing the game: You or the computer?",
      YOU_START_YES: "Yes",
      YOU_START_NO: "No",
    } as DictionaryEntry;

    const game = {
      first: Player.User,
      disabled,
    } as State;

    const dispatch = jest.fn();

    const utils = render(
      <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
        <GameContext.Provider value={{ game, dispatch }}>
          <StartGame />
        </GameContext.Provider>
      </DictionaryContext.Provider>
    );

    const divWrapper = screen.getByTestId("startgame");

    const selectStartGame = screen.getByRole("combobox");

    const options = screen.getAllByRole("option");

    const optionYes = screen.getByRole("option", {
      name: mockDictionary.YOU_START_YES,
    }) as HTMLOptionElement;

    const optionNo = screen.getByRole("option", {
      name: mockDictionary.YOU_START_NO,
    }) as HTMLOptionElement;

    return {
      ...utils,
      mockDictionary,
      dispatch,
      divWrapper,
      selectStartGame,
      options,
      optionYes,
      optionNo,
    };
  };

  it("should render correctly", () => {
    const { asFragment } = renderStartGame();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should display the start player dropdown", () => {
    renderStartGame();

    expect(screen.getByTestId("startgame")).toBeInTheDocument();
  });

  it("should display the 'start' class", () => {
    const { divWrapper } = renderStartGame();

    expect(divWrapper).toHaveClass("start");
  });

  it("should correctly set default option", () => {
    const { optionYes } = renderStartGame();

    expect(optionYes.selected).toBeTruthy();
  });

  it("should display the correct number of options", () => {
    const { options } = renderStartGame();

    expect(options).toHaveLength(2);
  });

  it("should change the starting player in the dropdown", () => {
    const { dispatch, selectStartGame, optionYes, optionNo } =
      renderStartGame();

    expect(selectStartGame).toHaveValue(Player.User + "");
    expect(optionYes.selected).toBeTruthy();
    expect(optionNo.selected).toBeFalsy();

    userEvent.selectOptions(selectStartGame, optionNo);

    expect(selectStartGame).toHaveValue(Player.Computer + "");
    expect(optionYes.selected).toBeFalsy();
    expect(optionNo.selected).toBeTruthy();

    expect(dispatch).toBeCalled();
  });

  it("should not allow the user to change game starting user", () => {
    const disabled = true;
    const { dispatch, selectStartGame, optionNo } = renderStartGame(disabled);

    expect(selectStartGame).toHaveValue(Player.User + "");
    userEvent.selectOptions(selectStartGame, optionNo);

    expect(selectStartGame).toHaveValue(Player.User + "");
    expect(dispatch).not.toBeCalled();
  });
});
