import React from "react";
import { useQuery } from "@apollo/client";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { useParams } from "react-router-dom";
import { DictionaryContext } from "../../../contexts/dictionary/DictionaryContext";
import GameHistorical from "../../../pages/GameHistorical/GameHistorical";
import { DBGame } from "../../../types";

interface Props {
  game: DBGame;
}

jest.mock("../../../components/Game/Historical", () => ({ game }: Props) => {
  return (
    <>
      <div>category id: {game.categoryId}</div>
      <div>image user: {game.userImage}</div>
      <div>image computer: {game.computerImage}</div>
      <div>first: {game.first}</div>
      <div>level: {game.level}</div>
      <div>board: {game.board}</div>
      <button>See Game</button>
      <button>Delete Game</button>
    </>
  );
});

jest.mock("@apollo/client", () => ({
  useQuery: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));

describe("GameHistorical", () => {
  const gameId = "637c268c2079f86953546d9a";

  const mockGameFetchedFromDB: DBGame = {
    _id: gameId,
    board: [0, 2, 2, 1, 0, 2, 1, 2, 0],
    categoryId: 5,
    first: 0,
    computerImage: 12,
    userImage: 15,
    level: 0,
    result: 3,
    winners: [0, 4, 8],
    user: "636048af80d558d24d56265e",
    createdAt: "2022-11-22T01:31:56.533Z",
    updatedAt: "2022-11-22T01:31:56.533Z",
    __v: 0,
  };

  const mockDictionary = {
    HISTORICAL_NO_DATA_YET:
      "There is no historical data yet. Play some games and comeback.",
    HISTORICAL_FETCHING_GAME_ERROR:
      "An error ocurred while fetching the game from the database.",
    HISTORICAL_FETCHING_GAME: "Fetching game...",
  };

  interface GameHistoricalWithProviderProps {
    game?: DBGame | null;
    loading?: boolean;
    error?: string;
  }

  const GameHistoricalWithProvider = ({
    game = null,
    loading = true,
    error = undefined,
  }: GameHistoricalWithProviderProps = {}) => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsInVzZXJJZCI6IjYzOGE1MDhhNjY3YmE3MWE3YmIxYWQ0MiIsImlhdCI6MTcwNzE3MDYwMywiZXhwIjoxNzA3MTc0MjAzfQ.6ytTyHfNTiKjW0OiwQglzpyJ8Drsrby-4g4eZotQfJs";

    const result = {
      data: game === null ? {} : { game },
      loading,
      error,
    };

    (useQuery as jest.Mock).mockImplementationOnce(() => result);

    (useParams as jest.Mock).mockImplementationOnce(() => ({ id: gameId }));

    return (
      <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
        <GameHistorical token={token} />
      </DictionaryContext.Provider>
    );
  };

  it("should render correctly", () => {
    const { asFragment } = render(<GameHistoricalWithProvider />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("should show the historical of a game once it has been fetched", () => {
    const { rerender } = render(<GameHistoricalWithProvider />);
    const { categoryId, userImage, computerImage, first, level } =
      mockGameFetchedFromDB;

    rerender(
      <GameHistoricalWithProvider
        game={mockGameFetchedFromDB}
        loading={false}
      />
    );

    expect(screen.getByText(`category id: ${categoryId}`)).toBeInTheDocument();
    expect(screen.getByText(`image user: ${userImage}`)).toBeInTheDocument();
    expect(
      screen.getByText(`image computer: ${computerImage}`)
    ).toBeInTheDocument();
    expect(screen.getByText(`first: ${first}`)).toBeInTheDocument();
    expect(screen.getByText(`level: ${level}`)).toBeInTheDocument();
    expect(screen.getByText(/board:/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /see game/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /delete game/i,
      })
    ).toBeInTheDocument();
  });

  it("should display an error when fetching the historical game failed", () => {
    const { rerender } = render(<GameHistoricalWithProvider />);

    rerender(<GameHistoricalWithProvider loading={false} error="error" />);

    expect(
      screen.getByText(mockDictionary.HISTORICAL_FETCHING_GAME_ERROR)
    ).toBeInTheDocument();
  });

  it("should display the fetching message", () => {
    const { rerender } = render(<GameHistoricalWithProvider />);

    rerender(<GameHistoricalWithProvider />);

    expect(
      screen.getByText(mockDictionary.HISTORICAL_FETCHING_GAME)
    ).toBeInTheDocument();
  });
});
