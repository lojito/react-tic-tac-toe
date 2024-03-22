import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { GameContext, State } from "../../../contexts/game/GameContext";
import Repository from "../../../pages/Repository/Repository";

jest.mock("../../../components/Category/Category", () => () => <select />);

describe("Repository", () => {
  const renderRepository = () => {
    const game = {
      category: {
        id: 0,
        folder: "habana",
        name: "CATEGORY_HAVANA_LANDMARKS",
      },
    } as State;

    const dispatch = jest.fn();

    const utils = render(
      <GameContext.Provider value={{ game, dispatch }}>
        <Repository />
      </GameContext.Provider>
    );

    const divWrapper = screen.getByTestId("repository");
    const divImages = screen.getByTestId("images");
    const images = screen.getAllByAltText("user");

    return { ...utils, divWrapper, divImages, images };
  };

  it("renders the Repository component correctly", () => {
    const { asFragment } = renderRepository();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should apply the repository class name", () => {
    const { divWrapper } = renderRepository();

    expect(divWrapper).toHaveClass("repository");
  });

  it("should apply the repository-images class name", () => {
    const { divImages } = renderRepository();

    expect(divImages).toHaveClass("repository-images");
  });

  it("should display the right number of images", () => {
    const { images } = renderRepository();

    expect(images).toHaveLength(20);
  });

  it("should apply the right url to the images", () => {
    const url = "/images";

    const { images } = renderRepository();

    for (const image of images) {
      expect(image).toHaveAttribute("src", expect.stringContaining(url));
    }
  });
});
