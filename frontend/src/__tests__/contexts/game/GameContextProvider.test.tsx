import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import React, { useContext } from "react";
import { GameContext } from "../../../contexts/game/GameContext";
import GameContextProvider from "../../../contexts/game/GameContextProvider";
import mockInitialState from "../../../contexts/game/GameInitialState";
import { GameResult, SquareLocation } from "../../../types";

jest.mock("../../../reducers/gameReducer", () => ({
  __esModule: true,
  default: () => ({
    ...mockInitialState,
  }),
}));

describe("GameContextProvider", () => {
  let disabled: boolean;
  let over: boolean;
  let result: GameResult;
  let winners: SquareLocation[];

  const renderTestGameContextProvider = () => {
    const TestComponent = () => {
      const { game } = useContext(GameContext);
      const { category, userImage, computerImage, first, level } = game;

      ({ disabled, over, result, winners } = game);

      return (
        <>
          <label htmlFor="categories">{category.name}</label>
          <select id="categories" />

          <img alt={userImage + ""} title={userImage + ""} />
          <img alt={computerImage + ""} title={computerImage + ""} />

          <label htmlFor="first">First:{first}</label>
          <select id="first" />

          <label htmlFor="level">PlayingLevel:{level}</label>
          <select id="level" />
        </>
      );
    };

    return render(
      <GameContextProvider>
        <TestComponent />
      </GameContextProvider>
    );
  };

  it("should provide the state", () => {
    renderTestGameContextProvider();

    expect(
      screen.getByLabelText(mockInitialState.category.name)
    ).toBeInTheDocument();

    const images = screen.getAllByRole("img");
    const titleText = images.map((image) => image.title);

    expect(titleText).toEqual([
      mockInitialState.userImage + "",
      mockInitialState.computerImage + "",
    ]);

    expect(
      screen.getByLabelText(`First:${mockInitialState.first}`)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(`PlayingLevel:${mockInitialState.level}`)
    ).toBeInTheDocument();

    expect(disabled).toBe(mockInitialState.disabled);
    expect(over).toBe(mockInitialState.over);
    expect(result).toBe(mockInitialState.result);
    expect(winners).toEqual(mockInitialState.winners);
  });
});
