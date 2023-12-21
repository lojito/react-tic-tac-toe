import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Game from "../../../components/Game/Game";
import {
  DictionaryContext,
  DictionaryEntry,
} from "../../../contexts/dictionary/DictionaryContext";
import { GameContext, State } from "../../../contexts/game/GameContext";
import useSaveGame from "../../../hooks/game/useSaveGame";
import useGameInit from "../../../hooks/useGameInit";
import useGameOver from "../../../hooks/useGameOver";
import useGameStart from "../../../hooks/useGameStart";

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

jest.mock("../../../hooks/useGameStart");
jest.mock("../../../hooks/useGameOver");
jest.mock("../../../hooks/useGameInit");
jest.mock("../../../hooks/game/useSaveGame");

describe("Game", () => {
  const mockHandleGameOver = jest.fn();
  const mockHandleSaveGame = jest.fn();

  interface Props {
    result: GameResult;
    gameOver: boolean;
    disabled?: boolean;
  }

  const renderGame = (
    {
      result = GameResult.Started,
      gameOver = false,
      disabled = false,
    }: Props = { result: GameResult.Started, gameOver: false, disabled: false }
  ) => {
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
      MESSAGE_WON: "You won!",
      MESSAGE_LOST: "You lost!",
      MESSAGE_DRAW: "It's a draw!",
      WELCOME_BACK: "Welcome back",
    } as DictionaryEntry;

    (useGameInit as jest.Mock).mockReturnValue({
      handleGameInit: jest.fn,
    });

    (useGameOver as jest.Mock).mockReturnValue({
      handleGameOver: mockHandleGameOver,
    });

    (useGameStart as jest.Mock).mockReturnValue({
      handleGameStart: jest.fn,
    });

    (useSaveGame as jest.Mock).mockReturnValue({
      handleSaveGame: mockHandleSaveGame,
    });

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
      disabled,
      result,
      over: gameOver,
    } as State;

    const dispatch = jest.fn();
    const name = "Livan";
    const utils = render(
      <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
        <GameContext.Provider value={{ game, dispatch }}>
          <Game token="token" name={name} />
        </GameContext.Provider>
      </DictionaryContext.Provider>
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

    expect(buttonPlay).toHaveTextContent(mockDictionary["BUTTON_PLAY"]);
  });

  it("should save the game info", () => {
    const { buttonBoard } = renderGame();

    userEvent.click(buttonBoard);

    expect(mockHandleGameOver).toHaveBeenCalled();
    expect(mockHandleSaveGame).toHaveBeenCalled();
  });
});
