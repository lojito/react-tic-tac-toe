import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import GameHistorical from "../../../components/Historical/GameHistorical";
import {
  DictionaryContext,
  DictionaryEntry,
} from "../../../contexts/dictionary/DictionaryContext";
import useDeleteGame from "../../../hooks/game/useDeleteGame";
import useFetchGame from "../../../hooks/game/useFetchGame";
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

jest.mock("../../../hooks/game/useFetchGame");
jest.mock("../../../hooks/game/useDeleteGame");

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
    GAME_DELETE_ERROR:
      "An error ocurred while deleting the game from the database.",
  } as DictionaryEntry;

  const mockHandleFetchGame = jest.fn();
  const mockHandleDeleteGame = jest.fn();

  const mockHistory = createMemoryHistory();
  mockHistory.push = jest.fn();

  interface GameHistoricalWithProviderProps {
    game?: DBGame | null;
    errorFetchingGame?: boolean;
    isFetching?: boolean;
    gameId?: string;
    errorDeletingGame?: boolean;
  }

  const GameHistoricalWithProvider = (
    {
      game = null,
      errorFetchingGame = false,
      isFetching = false,
      gameId = "",
      errorDeletingGame = false,
    }: GameHistoricalWithProviderProps = {
      game: null,
      errorFetchingGame: false,
      isFetching: false,
      gameId: "",
      errorDeletingGame: false,
    }
  ) => {
    const mockMatch = {
      params: {
        id: gameId,
      },
      isExact: true,
      path: "",
      url: "",
    };

    (useFetchGame as jest.Mock).mockReturnValue({
      game,
      error: errorFetchingGame,
      isFetching,
      handleFetchGame: mockHandleFetchGame,
    });

    (useDeleteGame as jest.Mock).mockReturnValue({
      gameId,
      error: errorDeletingGame,
      handleDeleteGame: mockHandleDeleteGame,
    });

    return (
      <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
        <GameHistorical token="token" match={mockMatch} history={mockHistory} />
      </DictionaryContext.Provider>
    );
  };

  it("should render correctly", () => {
    const { asFragment } = render(<GameHistoricalWithProvider />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("should show the historical of a game once it has been fetched", () => {
    const { rerender } = render(<GameHistoricalWithProvider />);

    let deleteGameButton = screen.queryByRole("button", {
      name: "Delete Game",
    });
    expect(deleteGameButton).not.toBeInTheDocument();

    rerender(<GameHistoricalWithProvider game={mockGameFetchedFromDB} />);

    const { categoryId, userImage, computerImage, first, level } =
      mockGameFetchedFromDB;
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

  it("should display an error because fetching the game failed", () => {
    const { rerender } = render(<GameHistoricalWithProvider />);

    const error = "An error ocurred while fetching the game from the database.";

    rerender(<GameHistoricalWithProvider errorFetchingGame={true} />);

    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it("should display the fetching message", () => {
    const { rerender } = render(<GameHistoricalWithProvider />);

    const fetchingMessage = "Fetching game...";

    rerender(<GameHistoricalWithProvider isFetching={true} />);

    expect(screen.getByText(fetchingMessage)).toBeInTheDocument();
  });

  it("should display the no historical games message", () => {
    render(<GameHistoricalWithProvider />);

    expect(
      screen.getByText(mockDictionary.HISTORICAL_NO_DATA_YET)
    ).toBeInTheDocument();
  });

  it("should call the delete game handler", () => {
    const { rerender } = render(<GameHistoricalWithProvider />);

    rerender(<GameHistoricalWithProvider game={mockGameFetchedFromDB} />);

    const deleteGameButton = screen.getByRole("button", {
      name: "Delete Game",
    });

    userEvent.click(deleteGameButton!);

    expect(mockHandleDeleteGame).toBeCalled();
  });

  it("should route to the historical page", () => {
    const { rerender } = render(<GameHistoricalWithProvider />);

    rerender(<GameHistoricalWithProvider game={mockGameFetchedFromDB} />);

    const deleteGameButton = screen.getByRole("button", {
      name: "Delete Game",
    });
    userEvent.click(deleteGameButton!);

    rerender(<GameHistoricalWithProvider gameId={gameId} />);

    expect(mockHistory.push).toBeCalled();
  });

  it("should error while trying to delete a game", () => {
    const { rerender } = render(<GameHistoricalWithProvider />);

    rerender(<GameHistoricalWithProvider game={mockGameFetchedFromDB} />);

    const deleteGameButton = screen.getByRole("button", {
      name: "Delete Game",
    });
    userEvent.click(deleteGameButton!);

    const error = "An error ocurred while deleting the game from the database.";
    rerender(
      <GameHistoricalWithProvider
        gameId={gameId}
        game={mockGameFetchedFromDB}
        errorDeletingGame={true}
      />
    );

    expect(screen.getByText(error)).toBeInTheDocument();
  });
});
