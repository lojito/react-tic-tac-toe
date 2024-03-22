import React from "react";
import { useMutation } from "@apollo/client";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DictionaryContext } from "../../../contexts/dictionary/DictionaryContext";
import { GameContext, State } from "../../../contexts/game/GameContext";
import useGameInit from "../../../hooks/game/useGameInit";
import useGameOver from "../../../hooks/game/useGameOver";
import useGameStart from "../../../hooks/game/useGameStart";
import Game from "../../../pages/Game/Game";
import { GameResult, Player, PlayingLevel } from "../../../types";

jest.mock("../../../components/Category/Category", () => () => (
  <div>Category: Soccer players</div>
));

jest.mock("../../../components/Image/Image", () => () => (
  <>
    <div>User: Messi</div>
    <div>Computer: Ronaldo</div>
  </>
));

jest.mock("../../../components/StartGame/StartGame", () => () => (
  <div>You start: Yes</div>
));

jest.mock("../../../components/PlayingLevel/PlayingLevel", () => () => (
  <div>Playing Level: Easy</div>
));

jest.mock(
  "../../../components/BoardUI/BoardUI",
  () =>
    ({ onGameOver }: { onGameOver: () => void }) => {
      return (
        <button aria-label="board" onClick={() => onGameOver()}>
          BoardUI
        </button>
      );
    }
);

jest.mock("../../../hooks/game/useGameStart");
jest.mock("../../../hooks/game/useGameOver");
jest.mock("../../../hooks/game/useGameInit");

jest.mock("@apollo/client", () => ({
  useMutation: jest.fn(),
}));

describe("Game", () => {
  const mockHandleGameOver = jest.fn();

  const mockDictionary = {
    BUTTON_PLAY: "Start the game",
    BUTTON_PLAY_AGAIN: "Play again",
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
    GAME_SAVE_ERROR:
      "An error ocurred while saving the game results into the database",
    GAME_SAVING: "Saving the game data...",
    MESSAGE_WON: "You won!",
    MESSAGE_LOST: "You lost!",
    MESSAGE_DRAW: "It's a draw!",
    WELCOME_BACK: "Welcome back",
  };

  const mockAddGame = jest.fn();

  interface GameWithProviderProps {
    result?: GameResult;
    gameOver?: boolean;
    disabled?: boolean;
    addGame?: jest.Mock;
    name?: string;
  }

  const TestComponent = ({
    disabled = false,
    gameOver = false,
    result = GameResult.Started,
    name = "Livan",
  }: GameWithProviderProps = {}) => {
    const game = {
      category: {
        id: 0,
        folder: "habana",
        name: "CATEGORY_HAVANA_LANDMARKS",
      },
      userImage: 0,
      computerImage: 1,
      first: Player.User,
      level: PlayingLevel.Easy,
    } as State;
    game.disabled = disabled;
    game.over = gameOver;
    game.result = result;

    const dispatch = jest.fn();

    return (
      <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
        <GameContext.Provider value={{ game, dispatch }}>
          <Game token="token" name={name} />
        </GameContext.Provider>
      </DictionaryContext.Provider>
    );
  };

  const renderGame = ({
    result = GameResult.Started,
    gameOver = false,
    disabled = false,
    addGame = mockAddGame,
  }: GameWithProviderProps = {}) => {
    (useGameInit as jest.Mock).mockReturnValue({
      handleGameInit: jest.fn,
    });

    (useGameOver as jest.Mock).mockReturnValue({
      handleGameOver: mockHandleGameOver,
    });

    (useGameStart as jest.Mock).mockReturnValue({
      handleGameStart: jest.fn,
    });

    (useMutation as jest.Mock).mockReturnValue([
      addGame,
      { loading: false, error: "" },
    ]);

    const name = "Livan";
    const utils = render(
      <TestComponent
        disabled={disabled}
        name={name}
        gameOver={gameOver}
        result={result}
      />
    );

    const welcomeBack = screen.getByText(`Welcome back, ${name}`);

    const categorySoccer = screen.getByText(/Category: soccer players/i);
    const userImage = screen.getByText(/User: Messi/i);
    const computerImage = screen.getByText(/Computer: Ronaldo/i);
    const startGameYou = screen.getByText(/You start: Yes/i);
    const playingLevelEasy = screen.getByText(/Playing Level: Easy/i);

    let message: HTMLElement | null;
    if (result === GameResult.Lost) {
      message = screen.getByText(mockDictionary.MESSAGE_LOST);
    } else if (result === GameResult.Draw) {
      message = screen.getByText(mockDictionary.MESSAGE_DRAW);
    } else if (result === GameResult.Won) {
      message = screen.getByText(mockDictionary.MESSAGE_WON);
    } else {
      message = null;
    }

    const buttonPlay = screen.getByRole("button", { name: "play" });
    const buttonBoard = screen.getByRole("button", { name: "board" });

    return {
      ...utils,
      mockDictionary,
      welcomeBack,
      categorySoccer,
      userImage,
      computerImage,
      startGameYou,
      playingLevelEasy,
      message,
      buttonPlay,
      buttonBoard,
    };
  };

  it("renders correctly", () => {
    const { asFragment } = renderGame();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should display the welcome back message", () => {
    const { welcomeBack } = renderGame();

    expect(welcomeBack).toBeInTheDocument();
  });

  it("should display the Category component", () => {
    const { categorySoccer } = renderGame();

    expect(categorySoccer).toBeInTheDocument();
  });

  it("should display the Image component for the user", () => {
    const { userImage } = renderGame();

    expect(userImage).toBeInTheDocument();
  });

  it("should display the Image component for the computer", () => {
    const { computerImage } = renderGame();

    expect(computerImage).toBeInTheDocument();
  });

  it("should display the Start game component", () => {
    const { startGameYou } = renderGame();

    expect(startGameYou).toBeInTheDocument();
  });

  it("should display the Playing level component", () => {
    const { playingLevelEasy } = renderGame();

    expect(playingLevelEasy).toBeInTheDocument();
  });

  it("should display the game lost message", () => {
    const gameOver = true;
    const result = GameResult.Lost;

    const { message: messageLost } = renderGame({ result, gameOver });

    expect(messageLost).toBeInTheDocument();
  });

  it("should display the game won message", () => {
    const gameOver = true;
    const result = GameResult.Draw;

    const { message: messageDraw } = renderGame({ result, gameOver });

    expect(messageDraw).toBeInTheDocument();
  });

  it("should display the game draw message", () => {
    const gameOver = true;
    const result = GameResult.Won;

    const { message: messageWon } = renderGame({ result, gameOver });

    expect(messageWon).toBeInTheDocument();
  });

  it("should not display any message", () => {
    const { mockDictionary } = renderGame();

    expect(
      screen.queryByText(mockDictionary.MESSAGE_LOST)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(mockDictionary.MESSAGE_DRAW)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(mockDictionary.MESSAGE_WON)
    ).not.toBeInTheDocument();
  });

  it("should not disable the button before starting the game", () => {
    const { buttonPlay } = renderGame();

    expect(buttonPlay).toBeEnabled();
  });

  it("should not disable the button when game is over", () => {
    const gameOver = true;
    const result = GameResult.Lost;

    const { buttonPlay } = renderGame({ result, gameOver });

    expect(buttonPlay).toBeEnabled();
  });

  it("should disable the button when game has started", () => {
    const gameOver = false;
    const result = GameResult.Started;
    const disabled = true;

    const { buttonPlay } = renderGame({ result, gameOver, disabled });

    expect(buttonPlay).toBeDisabled();
  });

  it("should display the correct text of the button", () => {
    const { buttonPlay, mockDictionary } = renderGame();

    expect(buttonPlay).toHaveTextContent(mockDictionary.BUTTON_PLAY);
  });

  it("should save the game info", async () => {
    const user = userEvent.setup();
    const { buttonBoard } = renderGame();

    await user.click(buttonBoard);

    expect(mockHandleGameOver).toHaveBeenCalled();
  });

  it("should display the loading message while saving the game data", async () => {
    const user = userEvent.setup();
    const { buttonBoard, rerender } = renderGame();

    await user.click(buttonBoard);

    (useMutation as jest.Mock).mockReturnValueOnce([
      mockAddGame,
      { loading: true },
    ]);

    rerender(<TestComponent result={GameResult.Draw} />);

    expect(screen.getByText(mockDictionary.GAME_SAVING)).toBeInTheDocument();
  });

  it("should display an error when the add game handler throws one", async () => {
    const user = userEvent.setup();
    const { buttonBoard, rerender } = renderGame();

    await user.click(buttonBoard);

    (useMutation as jest.Mock).mockReturnValueOnce([
      mockAddGame,
      { error: "There was an error saving the game data." },
    ]);

    rerender(<TestComponent />);

    expect(
      screen.getByText(mockDictionary.GAME_SAVE_ERROR)
    ).toBeInTheDocument();
  });
});
