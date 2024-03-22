import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import StartGame from "../../../components/StartGame/StartGame";
import { DictionaryContext } from "../../../contexts/dictionary/DictionaryContext";
import { FirstPlayer } from "../../../types";

jest.mock("../../../components/Setting/Setting", () => () => (
  <div>Start Game</div>
));

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
  const mockDictionary = {
    START_GAME_LABEL: "Who plays first",
    START_GAME_TOOLTIP: "Who starts playing the game: You or the computer?",
    START_GAME_ANSWER_YES: "Yes",
    START_GAME_ANSWER_NO: "No",
  };

  const renderStartGame = () => {
    return render(
      <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
        <StartGame />
      </DictionaryContext.Provider>
    );
  };

  it("should render correctly", () => {
    const { asFragment } = renderStartGame();

    expect(asFragment()).toMatchSnapshot();
  });
});
