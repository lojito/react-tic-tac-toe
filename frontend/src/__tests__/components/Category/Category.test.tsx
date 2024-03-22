import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Category from "../../../components/Category/Category";
import { DictionaryContext } from "../../../contexts/dictionary/DictionaryContext";
import { GameContext, State } from "../../../contexts/game/GameContext";
import { Categories } from "../../../types";

jest.mock("../../../actions/game", () => {
  return {
    changeCategory: (category: Categories) => {
      return {
        type: "CHANGE_CATEGORY",
        category,
      };
    },
  };
});

describe("Category", () => {
  const mockDictionary = {
    CATEGORY_ANIMALS: "Animals",
    CATEGORY_FRUITS_AND_VEGETABLES: "Fruits & Vegetables",
    CATEGORY_GERMANY_LANDMARKS: "Germany landmarks",
    CATEGORY_HAVANA_LANDMARKS: "Havana landmarks",
    CATEGORY_MONTREAL_LANDMARKS: "Montreal landmarks",
    CATEGORY_PUPPIES: "Puppies",
    CATEGORY_SEINFELD: "Seinfeld",
    CATEGORY_SOCCER_PLAYERS: "Soccer players",
    CATEGORY_SPAIN_LANDMARKS: "Spain landmarks",
    CATEGORY_VANCOUVER_LANDMARKS: "Vancouver landmarks",
    CATEGORY: "Category",
  };

  const renderCategory = () => {
    const game = {
      category: {
        id: 0,
        folder: "habana",
        name: "CATEGORY_HAVANA_LANDMARKS",
      },
    } as State;

    const dispatch = jest.fn();

    const utils = render(
      <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
        <GameContext.Provider value={{ game, dispatch }}>
          <Category />
        </GameContext.Provider>
      </DictionaryContext.Provider>
    );

    const divWrapper = screen.getByTestId("categories");

    const labelCategory = screen.getByLabelText(`${mockDictionary.CATEGORY}:`);

    const selectCategory = screen.getByRole("combobox");

    const optionVancouver = screen.getByRole("option", {
      name: mockDictionary.CATEGORY_VANCOUVER_LANDMARKS,
    }) as HTMLOptionElement;

    return {
      ...utils,
      mockDictionary,
      dispatch,
      divWrapper,
      labelCategory,
      selectCategory,
      optionVancouver,
    };
  };

  it("renders the Category component correctly", () => {
    const { asFragment } = renderCategory();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should apply the categories class", () => {
    const { divWrapper } = renderCategory();

    expect(divWrapper).toHaveClass("categories");
  });

  it("should display the category label", () => {
    const { labelCategory } = renderCategory();

    expect(labelCategory).toBeInTheDocument();
  });

  it("should change the current category", async () => {
    const user = userEvent.setup();
    const categoryVancouver = {
      folder: "vancouver",
      id: 2,
      name: "CATEGORY_VANCOUVER_LANDMARKS",
    };
    const { dispatch, selectCategory, optionVancouver } = renderCategory();

    await user.selectOptions(selectCategory, optionVancouver);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      category: categoryVancouver,
      type: "CHANGE_CATEGORY",
    });
  });
});
