import React from "react";
import { useQuery } from "@apollo/client";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import GamesHistorical from "../../../pages/GamesHistorical/GamesHistorical";
import { DictionaryContext } from "../../../contexts/dictionary/DictionaryContext";
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
      <button>See Game</button>
      <button>Delete Game</button>
    </>
  );
});

jest.mock("@apollo/client", () => ({
  useQuery: jest.fn(),
}));

describe("GamesHistorical", () => {
  const mockGamesFetchedFromDB = [
    {
      _id: "637c268c2079f86953546d9a",
      categoryId: 5,
      computerImage: 12,
      userImage: 15,
      first: 0,
      level: 0,
      result: 3,
    },
  ] as DBGame[];

  const mockDictionary = {
    HISTORICAL_NO_DATA_YET:
      "There is no historical data yet. Play some games and comeback.",
    HISTORICAL_FETCHING_GAMES_ERROR:
      "An error ocurred while fetching the games from the database.",
    HISTORICAL_FETCHING_GAMES: "Fetching games...",
  };

  interface GamesHistoricalWithProviderProps {
    games?: DBGame[] | null;
    loading?: boolean;
    error?: string;
  }

  const GamesHistoricalWithProvider = ({
    games = null,
    loading = true,
    error = undefined,
  }: GamesHistoricalWithProviderProps = {}) => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsInVzZXJJZCI6IjYzOGE1MDhhNjY3YmE3MWE3YmIxYWQ0MiIsImlhdCI6MTcwNzE3MDYwMywiZXhwIjoxNzA3MTc0MjAzfQ.6ytTyHfNTiKjW0OiwQglzpyJ8Drsrby-4g4eZotQfJs";
    const result = {
      data: games === null ? {} : { games },
      loading,
      error,
    };
    (useQuery as jest.Mock).mockImplementationOnce(() => result);

    return (
      <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
        <GamesHistorical token={token} />
      </DictionaryContext.Provider>
    );
  };

  it("should render correctly", () => {
    const { asFragment } = render(<GamesHistoricalWithProvider />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("should show the historical of a game once the it has been fetched", () => {
    const { rerender } = render(<GamesHistoricalWithProvider />);
    const { categoryId, userImage, computerImage, first, level } =
      mockGamesFetchedFromDB[0];

    rerender(
      <GamesHistoricalWithProvider
        games={mockGamesFetchedFromDB}
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

  it("should display an error when fetching the historical games failed", () => {
    render(<GamesHistoricalWithProvider loading={false} error="error" />);

    expect(
      screen.getByText(mockDictionary.HISTORICAL_FETCHING_GAMES_ERROR)
    ).toBeInTheDocument();
  });

  it("should display the fetching message", () => {
    const { rerender } = render(<GamesHistoricalWithProvider />);

    rerender(<GamesHistoricalWithProvider />);

    expect(
      screen.getByText(mockDictionary.HISTORICAL_FETCHING_GAMES)
    ).toBeInTheDocument();
  });

  it("should display the no historical games message", () => {
    render(<GamesHistoricalWithProvider games={[]} loading={false} />);

    expect(
      screen.getByText(mockDictionary.HISTORICAL_NO_DATA_YET)
    ).toBeInTheDocument();
  });
});
