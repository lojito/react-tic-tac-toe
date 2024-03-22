import React from "react";
import { useMutation } from "@apollo/client";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import Historical from "../../../components/Game/Historical";
import { DictionaryContext } from "../../../contexts/dictionary/DictionaryContext";
import { DBGame, GameResult, Player, PlayingLevel } from "../../../types";

jest.mock("../../../components/Category/Historical", () => () => (
  <div>Category: Soccer players</div>
));

jest.mock("../../../components/Image/Historical", () => () => (
  <>
    <div>User: Messi</div>
    <div>Computer: Ronaldo</div>
  </>
));

jest.mock("../../../components/StartGame/Historical", () => () => (
  <div>You start: Yes</div>
));

jest.mock("../../../components/PlayingLevel/Historical", () => () => (
  <div>Playing Level: Easy</div>
));

jest.mock("../../../components/BoardUI/Historical", () => () => (
  <div>BoardUI</div>
));

jest.mock("@apollo/client", () => ({
  useMutation: jest.fn(),
}));

describe("Historical", () => {
  const gameId = "6354074f46bfb3571fe98ebc";

  const mockDBGame: DBGame = {
    _id: gameId,
    board: [2, 2, 2, 0, 1, 1, 1, 0, 1],
    categoryId: 5,
    first: Player.User,
    computerImage: 4,
    userImage: 3,
    level: PlayingLevel.Smart,
    result: GameResult.Won,
    winners: [0, 1, 2],
    createdAt: "2022-10-22T15:07:59.495Z",
    updatedAt: "2022-10-22T15:07:59.495Z",
    __v: 0,
  };

  const mockDictionary = {
    BUTTON_SEE_GAME: "See Game",
    BUTTON_BACK: "Back",
    BUTTON_DELETE_GAME: "Delete Game",
    MESSAGE_WON: "You won!",
    MESSAGE_LOST: "You lost!",
    MESSAGE_DRAW: "It's a draw!",
    GAME_DELETING: "Removing the game data from the database...",
    GAME_DELETE_ERROR:
      "An error ocurred while deleting the game from the database.",
  };

  const mockDeleteGame = jest.fn();

  const mockHistoryPush = jest.fn();

  jest.mock("react-router-dom", () => ({
    useHistory: () => ({
      push: mockHistoryPush,
    }),
  }));

  const history = createMemoryHistory();
  history.push = jest.fn();

  interface HistoricalWithProviderProps {
    result?: GameResult;
    displayBoard?: boolean;
    deleteGame?: jest.Mock;
  }

  const TestComponent = ({
    result = GameResult.Lost,
    displayBoard = false,
  }: HistoricalWithProviderProps = {}) => {
    mockDBGame.result = result;

    return (
      <Router history={history}>
        <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
          <Historical
            game={mockDBGame}
            displayBoard={displayBoard}
            token="token"
          />
        </DictionaryContext.Provider>
      </Router>
    );
  };

  const renderHistorical = ({
    result = GameResult.Lost,
    displayBoard = false,
    deleteGame = mockDeleteGame,
  }: HistoricalWithProviderProps = {}) => {
    (useMutation as jest.Mock).mockReturnValue([
      deleteGame,
      { data: undefined, loading: false, error: undefined },
    ]);

    const utils = render(
      <TestComponent displayBoard={displayBoard} result={result} />
    );

    const categorySoccer = screen.getByText(/category: soccer players/i);
    const userImage = screen.getByText(/user: Messi/i);
    const computerImage = screen.getByText(/computer: Ronaldo/i);
    const startGameYou = screen.getByText(/you start: yes/i);
    const playingLevelEasy = screen.getByText(/playing Level: easy/i);

    let message;
    if (result === GameResult.Lost) {
      message = screen.getByText(mockDictionary.MESSAGE_LOST);
    } else if (result === GameResult.Draw) {
      message = screen.getByText(mockDictionary.MESSAGE_DRAW);
    } else if (result === GameResult.Won) {
      message = screen.getByText(mockDictionary.MESSAGE_WON);
    } else {
      message = null;
    }

    const buttonDelete = screen.getByRole("button", {
      name: mockDictionary.BUTTON_DELETE_GAME,
    });

    return {
      ...utils,
      mockDictionary,
      categorySoccer,
      userImage,
      computerImage,
      startGameYou,
      playingLevelEasy,
      message,
      buttonDelete,
    };
  };

  it("should render correctly", () => {
    const { asFragment } = renderHistorical();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should display the Category component", () => {
    const { categorySoccer } = renderHistorical();

    expect(categorySoccer).toBeInTheDocument();
  });

  it("should display the Image component for the user", () => {
    const { userImage } = renderHistorical();

    expect(userImage).toBeInTheDocument();
  });

  it("should display the Image component for the computer", () => {
    const { computerImage } = renderHistorical();

    expect(computerImage).toBeInTheDocument();
  });

  it("should display the Start game component", () => {
    const { startGameYou } = renderHistorical();

    expect(startGameYou).toBeInTheDocument();
  });

  it("should display the Playing level component", () => {
    const { playingLevelEasy } = renderHistorical();

    expect(playingLevelEasy).toBeInTheDocument();
  });

  it("should not display the board", () => {
    renderHistorical();

    expect(screen.queryByText("BoardUI")).not.toBeInTheDocument();
  });

  it("should display the board", () => {
    const displayBoard = true;

    renderHistorical({ displayBoard });

    expect(screen.getByText("BoardUI")).toBeInTheDocument();
  });

  it("should display the winning game message", () => {
    const result = GameResult.Won;
    const displayBoard = true;

    const { message: messageWon } = renderHistorical({
      result,
      displayBoard,
    });

    expect(messageWon).toBeInTheDocument();
  });

  it("should display the lost game message", () => {
    const displayBoard = true;

    const { message: messageLost } = renderHistorical({ displayBoard });

    expect(messageLost).toBeInTheDocument();
  });

  it("should display the tie game message", () => {
    const result = GameResult.Draw;
    const displayBoard = true;

    const { message: messageDraw } = renderHistorical({
      result,
      displayBoard,
    });

    expect(messageDraw).toBeInTheDocument();
  });

  it("should display the See Game button if displayBoard is false", () => {
    renderHistorical();

    expect(screen.getByRole("link", { name: "See Game" })).toBeInTheDocument();
  });

  it("should not display the See Game button if displayBoard is true", () => {
    const displayBoard = true;

    renderHistorical({ displayBoard });

    expect(
      screen.queryByRole("link", { name: mockDictionary.BUTTON_SEE_GAME })
    ).not.toBeInTheDocument();
  });

  it("should display the Delete Game button", () => {
    renderHistorical();

    expect(
      screen.getByRole("button", { name: mockDictionary.BUTTON_DELETE_GAME })
    ).toBeInTheDocument();
  });

  it("should display the Back button if displayBoard is true", () => {
    const displayBoard = true;

    renderHistorical({ displayBoard });

    expect(
      screen.getByRole("link", { name: mockDictionary.BUTTON_BACK })
    ).toBeInTheDocument();
  });

  it("should not display the Back button if displayBoard is false", () => {
    renderHistorical();

    expect(
      screen.queryByRole("link", { name: mockDictionary.BUTTON_BACK })
    ).not.toBeInTheDocument();
  });

  it("should route to the historical of the game component when clicking on the See Game button", async () => {
    const user = userEvent.setup();
    renderHistorical();
    const buttonSeeGame = screen.getByRole("link", {
      name: mockDictionary.BUTTON_SEE_GAME,
    });

    await user.click(buttonSeeGame);

    expect(buttonSeeGame).toHaveAttribute("href", `/historical/${gameId}`);
  });

  it("should route to the historical of the games component when clicking on the Back button", async () => {
    const user = userEvent.setup();
    const displayBoard = true;
    renderHistorical({ displayBoard });
    const buttonBack = screen.getByRole("link", {
      name: mockDictionary.BUTTON_BACK,
    });

    await user.click(buttonBack);

    expect(buttonBack).toHaveAttribute("href", `/historical`);
  });

  it("should display the loading message while deleting the game data", async () => {
    const user = userEvent.setup();
    const { buttonDelete, rerender } = renderHistorical();

    await user.click(buttonDelete);

    (useMutation as jest.Mock).mockReturnValueOnce([
      mockDeleteGame,
      { loading: true },
    ]);

    rerender(<TestComponent result={GameResult.Draw} />);

    expect(screen.getByText(mockDictionary.GAME_DELETING)).toBeInTheDocument();
  });

  it("should call the delete game handler when displayBoard is false", async () => {
    const user = userEvent.setup();
    const { buttonDelete } = renderHistorical();

    await user.click(buttonDelete);

    expect(mockDeleteGame).toHaveBeenCalled();
  });

  it("should call the delete game handler when displayBoard is true", async () => {
    const user = userEvent.setup();
    const displayBoard = true;
    const { buttonDelete } = renderHistorical({ displayBoard });

    await user.click(buttonDelete);

    expect(mockDeleteGame).toHaveBeenCalled();
  });

  it("should display an error when trying to delete a game and displayBoard is false", async () => {
    const user = userEvent.setup();
    const { buttonDelete, rerender } = renderHistorical();

    await user.click(buttonDelete);

    (useMutation as jest.Mock).mockReturnValueOnce([
      mockDeleteGame,
      { error: "There was an error saving the game data." },
    ]);

    rerender(<TestComponent result={GameResult.Draw} />);

    expect(
      screen.getByText(mockDictionary.GAME_DELETE_ERROR)
    ).toBeInTheDocument();
  });

  it("should display an error when trying to delete a game and displayBoard is true", async () => {
    const user = userEvent.setup();
    const displayBoard = true;
    const { buttonDelete, rerender } = renderHistorical({ displayBoard });

    await user.click(buttonDelete);

    (useMutation as jest.Mock).mockReturnValueOnce([
      mockDeleteGame,
      { error: "There was an error saving the game data." },
    ]);

    rerender(<TestComponent displayBoard={true} />);

    expect(
      screen.getByText(mockDictionary.GAME_DELETE_ERROR)
    ).toBeInTheDocument();
  });

  it("should route to the historical of the games when deleting a game without error", async () => {
    const user = userEvent.setup();
    const { buttonDelete, rerender } = renderHistorical();

    await user.click(buttonDelete);

    (useMutation as jest.Mock).mockReturnValueOnce([
      mockDeleteGame,
      { data: "the game data" },
    ]);

    rerender(<TestComponent result={GameResult.Draw} />);

    expect(history.push).toHaveBeenCalled();
  });
});
