import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import HistoricalCategory from "../../../components/Category/Historical";
import {
  DictionaryContext,
  DictionaryEntry,
} from "../../../contexts/dictionary/DictionaryContext";

describe("CategoryHistorical", () => {
  const renderCategoryHistorical = () => {
    const mockDictionary = {
      CATEGORY: "Category",
      CATEGORY_SOCCER_PLAYERS: "Soccer players",
    } as DictionaryEntry;

    const utils = render(
      <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
        <HistoricalCategory categoryId={5} />
      </DictionaryContext.Provider>
    );

    const divWrapper = screen.getByTestId("categories");

    const categorySoccerPlayers = screen.getByText(
      mockDictionary.CATEGORY + ": Soccer players"
    );

    return {
      ...utils,
      mockDictionary,
      divWrapper,
      categorySoccerPlayers,
    };
  };

  it("should render correctly", () => {
    const { asFragment } = renderCategoryHistorical();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should apply the 'categories' class", () => {
    const { divWrapper } = renderCategoryHistorical();

    expect(divWrapper).toHaveClass("categories");
  });

  it("should find the text 'Category: Soccer players' in the document", () => {
    const { categorySoccerPlayers } = renderCategoryHistorical();

    expect(categorySoccerPlayers).toBeInTheDocument();
  });
});
