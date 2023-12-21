import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GamesHistorical from "../../../components/Historical/GamesHistorical";
import {
  DictionaryContext,
  DictionaryEntry,
} from "../../../contexts/dictionary/DictionaryContext";
import useDeleteGame from "../../../hooks/game/useDeleteGame";
import useFetchGames from "../../../hooks/game/useFetchGames";

import { DBGame } from "../../../types";

interface Props {
  game: DBGame;
  displayBoard: boolean;
  onDeleteGame: () => void;
}

jest.mock(
  "../../../components/Game/Historical",
  () =>
    ({ game, onDeleteGame }: Props) => {
      return (
        <>
          <div>category id: {game.categoryId}</div>
          <div>image user: {game.userImage}</div>
          <div>image computer: {game.computerImage}</div>
          <div>first: {game.first}</div>
          <div>level: {game.level}</div>
          <button onClick={() => onDeleteGame()}>Delete Game</button>
        </>
      );
    }
);

jest.mock("../../../hooks/game/useFetchGames");
jest.mock("../../../hooks/game/useDeleteGame");

describe("GamesHistorical", () => {
  const gameId = "637c268c2079f86953546d9a";

  const mockGamesFetchedFromDB = [
    {
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
    },
  ] as DBGame[];

  const mockDictionary = {
    HISTORICAL_NO_DATA_YET:
      "There is no historical data yet. Play some games and comeback.",
    HISTORICAL_FETCHING_GAMES_ERROR:
      "An error ocurred while fetching the games from the database.",
    HISTORICAL_FETCHING_GAMES: "Fetching games...",
    GAME_DELETE_ERROR:
      "An error ocurred while deleting the game from the database.",
  } as DictionaryEntry;

  const mockHandleFetchGames = jest.fn();
  const mockHandleDeleteGame = jest.fn();
  const mockHandleRemoveGame = jest.fn();

  interface GamesHistoricalWithProviderProps {
    games?: DBGame[] | null;
    errorFetchingGames?: boolean;
    isFetching?: boolean;
    gameId?: string;
    errorDeletingGame?: boolean;
  }

  const GamesHistoricalWithProvider = (
    {
      games = null,
      errorFetchingGames = false,
      isFetching = false,
      gameId = "",
      errorDeletingGame = false,
    }: GamesHistoricalWithProviderProps = {
      games: null,
      errorFetchingGames: false,
      isFetching: false,
      gameId: "",
      errorDeletingGame: false,
    }
  ) => {
    (useFetchGames as jest.Mock).mockReturnValue({
      games,
      error: errorFetchingGames,
      isFetching,
      handleFetchGames: mockHandleFetchGames,
      handleRemoveGame: mockHandleRemoveGame,
    });

    (useDeleteGame as jest.Mock).mockReturnValue({
      gameId,
      error: errorDeletingGame,
      handleDeleteGame: mockHandleDeleteGame,
    });

    return (
      <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
        <GamesHistorical token="token" />
      </DictionaryContext.Provider>
    );
  };

  it("should render correctly", () => {
    const { asFragment } = render(<GamesHistoricalWithProvider />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("should show the historical of a game once the it has been fetched", () => {
    const { rerender } = render(<GamesHistoricalWithProvider />);

    let deleteGameButton = screen.queryByRole("button", {
      name: "Delete Game",
    });
    expect(deleteGameButton).not.toBeInTheDocument();

    rerender(<GamesHistoricalWithProvider games={mockGamesFetchedFromDB} />);

    const { categoryId, userImage, computerImage, first, level } =
      mockGamesFetchedFromDB[0];
    expect(screen.getByText(`category id: ${categoryId}`)).toBeInTheDocument();
    expect(screen.getByText(`image user: ${userImage}`)).toBeInTheDocument();
    expect(
      screen.getByText(`image computer: ${computerImage}`)
    ).toBeInTheDocument();
    expect(screen.getByText(`first: ${first}`)).toBeInTheDocument();
    expect(screen.getByText(`level: ${level}`)).toBeInTheDocument();
    deleteGameButton = screen.getByRole("button", {
      name: "Delete Game",
    });
    expect(deleteGameButton).toBeInTheDocument();
  });

  it("should display an error because fetching the games failed", () => {
    const { rerender } = render(<GamesHistoricalWithProvider />);

    const error =
      "An error ocurred while fetching the games from the database.";

    rerender(<GamesHistoricalWithProvider errorFetchingGames={true} />);

    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it("should display the fetching message", () => {
    const { rerender } = render(<GamesHistoricalWithProvider />);

    const fetchingMessage = "Fetching games...";

    rerender(<GamesHistoricalWithProvider isFetching={true} />);

    expect(screen.getByText(fetchingMessage)).toBeInTheDocument();
  });

  it("should display the no historical games message", () => {
    render(<GamesHistoricalWithProvider />);

    expect(
      screen.getByText(mockDictionary.HISTORICAL_NO_DATA_YET)
    ).toBeInTheDocument();
  });

  it("should call the delete game handler", () => {
    const { rerender } = render(<GamesHistoricalWithProvider />);

    rerender(<GamesHistoricalWithProvider games={mockGamesFetchedFromDB} />);

    const deleteGameButton = screen.getByRole("button", {
      name: "Delete Game",
    });
    userEvent.click(deleteGameButton!);

    expect(mockHandleDeleteGame).toBeCalled();
  });

  it("should call the remove game handler", () => {
    const { rerender } = render(<GamesHistoricalWithProvider />);

    rerender(<GamesHistoricalWithProvider games={mockGamesFetchedFromDB} />);

    const deleteGameButton = screen.getByRole("button", {
      name: "Delete Game",
    });
    userEvent.click(deleteGameButton!);

    rerender(<GamesHistoricalWithProvider gameId={gameId} />);

    expect(mockHandleRemoveGame).toBeCalled();
  });

  it("should display the game deleting error", () => {
    const { rerender } = render(<GamesHistoricalWithProvider />);

    rerender(<GamesHistoricalWithProvider games={mockGamesFetchedFromDB} />);

    const deleteGameButton = screen.getByRole("button", {
      name: "Delete Game",
    });
    userEvent.click(deleteGameButton!);

    const error = "An error ocurred while deleting the game from the database.";
    rerender(
      <GamesHistoricalWithProvider
        gameId={gameId}
        games={mockGamesFetchedFromDB}
        errorDeletingGame={true}
      />
    );

    expect(screen.getByText(error)).toBeInTheDocument();
  });
});
