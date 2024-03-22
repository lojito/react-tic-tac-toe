import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import PlayingLevelHistorical from "../../../components/PlayingLevel/Historical";
import { DictionaryContext } from "../../../contexts/dictionary/DictionaryContext";
import { PlayingLevel } from "../../../types";

describe("PlayingLevelHistorical", () => {
  const mockDictionary = {
    PLAYING_LEVEL_LABEL: "Playing Level",
    PLAYING_LEVEL_EASY: "Easy",
    PLAYING_LEVEL_SMART: "Smart",
  };

  const renderPlayingLevelHistorical = (
    playingLevel: PlayingLevel = PlayingLevel.Easy
  ) => {
    const utils = render(
      <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
        <PlayingLevelHistorical level={playingLevel} />
      </DictionaryContext.Provider>
    );

    const divWrapper = screen.getByTestId("level");

    const historicalPlayingLevelEasyText = screen.queryByText(
      mockDictionary.PLAYING_LEVEL_LABEL +
        ": " +
        mockDictionary.PLAYING_LEVEL_EASY
    );

    const historicalPlayingLevelSmartText = screen.queryByText(
      mockDictionary.PLAYING_LEVEL_LABEL +
        ": " +
        mockDictionary.PLAYING_LEVEL_SMART
    );

    return {
      ...utils,
      mockDictionary,
      divWrapper,
      historicalPlayingLevelEasyText,
      historicalPlayingLevelSmartText,
    };
  };

  it("should render correctly", () => {
    const { asFragment } = renderPlayingLevelHistorical();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should apply the 'level' class", () => {
    const { divWrapper } = renderPlayingLevelHistorical();

    expect(divWrapper).toHaveClass("level");
  });

  it("should expect the text 'Playing Level: Easy' to be in the document", () => {
    const { historicalPlayingLevelEasyText } = renderPlayingLevelHistorical();

    expect(historicalPlayingLevelEasyText).toBeInTheDocument();
  });

  it("should expect the text 'Playing Level: Smart' to be in the document", () => {
    const playingLevelSmart = PlayingLevel.Smart;

    const { historicalPlayingLevelSmartText } =
      renderPlayingLevelHistorical(playingLevelSmart);

    expect(historicalPlayingLevelSmartText).toBeInTheDocument();
  });
});
