import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import PlayingLevel from "../../../components/PlayingLevel/PlayingLevel";
import { DictionaryContext } from "../../../contexts/dictionary/DictionaryContext";
import { PlayingLevel as Level } from "../../../types";

jest.mock("../../../components/Setting/Setting", () => () => (
  <div>Computer Playing Level</div>
));

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
  const mockDictionary = {
    PLAYING_LEVEL_LABEL: "Level",
    PLAYING_LEVEL_EASY: "Easy",
    PLAYING_LEVEL_SMART: "Smart",
    PLAYING_LEVEL_TOOLTIP:
      "How much thinking the computer does before playing.",
  };

  const renderPlayingLevel = () => {
    return render(
      <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
        <PlayingLevel />
      </DictionaryContext.Provider>
    );
  };

  it("should render correctly", () => {
    const { asFragment } = renderPlayingLevel();

    expect(asFragment()).toMatchSnapshot();
  });
});
