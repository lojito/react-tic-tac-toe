import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import Historical from "../../../components/StartGame/Historical";
import { DictionaryContext } from "../../../contexts/dictionary/DictionaryContext";
import { Player } from "../../../types";

describe("StartGameHistorical", () => {
  const mockDictionary = {
    GAME_STARTED_BY: "Started by",
    GAME_STARTED_BY_COMPUTER: "Computer",
    GAME_STARTED_BY_YOU: "You",
  };

  const renderStartGameHistorical = (
    first: Player.Computer | Player.User = Player.User
  ) => {
    const utils = render(
      <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
        <Historical first={first} />
      </DictionaryContext.Provider>
    );

    const divWrapper = screen.getByTestId("start");

    const historicalStartGameByYouText = screen.queryByText(
      `${mockDictionary.GAME_STARTED_BY}: ${mockDictionary.GAME_STARTED_BY_YOU}`
    );

    const historicalStartGameByComputerText = screen.queryByText(
      `${mockDictionary.GAME_STARTED_BY}: ${mockDictionary.GAME_STARTED_BY_COMPUTER}`
    );

    return {
      ...utils,
      mockDictionary,
      divWrapper,
      historicalStartGameByYouText,
      historicalStartGameByComputerText,
    };
  };

  it("should render correctly", () => {
    const { asFragment } = renderStartGameHistorical();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should apply the 'start' class", () => {
    const { divWrapper } = renderStartGameHistorical();

    expect(divWrapper).toHaveClass("start");
  });

  it("should expect the text 'Started by: You' to be in the document", () => {
    const { historicalStartGameByYouText } = renderStartGameHistorical();

    expect(historicalStartGameByYouText).toBeInTheDocument();
  });

  it("should expect the text 'Started by: Computer' to be in the document", () => {
    const whoStart = Player.Computer;

    const { historicalStartGameByComputerText } =
      renderStartGameHistorical(whoStart);

    expect(historicalStartGameByComputerText).toBeInTheDocument();
  });
});
