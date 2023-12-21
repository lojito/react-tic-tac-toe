import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import GameHistorical from "../../../components/Game/Historical";
import {
  DictionaryContext,
  DictionaryEntry,
} from "../../../contexts/dictionary/DictionaryContext";
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

describe("GameHistorical", () => {
  const mockDictionary = {
    BUTTON_SEE_GAME: "See Game",
    BUTTON_BACK: "Back",
    BUTTON_DELETE_GAME: "Delete Game",
    MESSAGE_WON: "You won!",
    MESSAGE_LOST: "You lost!",
    MESSAGE_DRAW: "It's a draw!",
  } as DictionaryEntry;

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

  const mockDeleteGame = jest.fn();

  interface Props {
    result?: GameResult;
    displayBoard?: boolean;
  }

  const renderGameHistorical = (
    { result = GameResult.Lost, displayBoard = false }: Props = {
      result: GameResult.Lost,
      displayBoard: false,
    }
  ) => {
    mockDBGame.result = result;

    const utils = render(
      <BrowserRouter>
        <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
          <GameHistorical
            game={mockDBGame}
            displayBoard={displayBoard}
            onDeleteGame={mockDeleteGame}
          />
        </DictionaryContext.Provider>
      </BrowserRouter>
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

    const buttonDelete = screen.getByRole("button", { name: "Delete Game" });

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
    const { asFragment } = renderGameHistorical();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should display the Category component", () => {
    const { categorySoccer } = renderGameHistorical();

    expect(categorySoccer).toBeInTheDocument();
  });

  it("should display the Image component for the user", () => {
    const { userImage } = renderGameHistorical();

    expect(userImage).toBeInTheDocument();
  });

  it("should display the Image component for the computer", () => {
    const { computerImage } = renderGameHistorical();

    expect(computerImage).toBeInTheDocument();
  });

  it("should display the Start game component", () => {
    const { startGameYou } = renderGameHistorical();

    expect(startGameYou).toBeInTheDocument();
  });

  it("should display the Playing level component", () => {
    const { playingLevelEasy } = renderGameHistorical();

    expect(playingLevelEasy).toBeInTheDocument();
  });

  it("should not display the board", () => {
    renderGameHistorical();

    expect(screen.queryByText("BoardUI")).not.toBeInTheDocument();
  });

  it("should display the board", () => {
    const displayBoard = true;

    renderGameHistorical({ displayBoard });

    expect(screen.getByText("BoardUI")).toBeInTheDocument();
  });

  it("should display the winning game message", () => {
    const result = GameResult.Won;
    const displayBoard = true;

    const { message: messageWon } = renderGameHistorical({
      result,
      displayBoard,
    });

    expect(messageWon).toBeInTheDocument();
  });

  it("should display the lost game message", () => {
    const displayBoard = true;

    const { message: messageLost } = renderGameHistorical({ displayBoard });

    expect(messageLost).toBeInTheDocument();
  });

  it("should display the tie game message", () => {
    const result = GameResult.Draw;
    const displayBoard = true;

    const { message: messageDraw } = renderGameHistorical({
      result,
      displayBoard,
    });

    expect(messageDraw).toBeInTheDocument();
  });

  it("should display the See Game button if displayBoard is false", () => {
    renderGameHistorical();

    expect(screen.getByRole("link", { name: "See Game" })).toBeInTheDocument();
  });

  it("should not display the See Game button if displayBoard is true", () => {
    const displayBoard = true;

    renderGameHistorical({ displayBoard });

    expect(
      screen.queryByRole("link", { name: mockDictionary.BUTTON_SEE_GAME })
    ).not.toBeInTheDocument();
  });

  it("should display the Delete Game button", () => {
    renderGameHistorical();

    expect(
      screen.getByRole("button", { name: mockDictionary.BUTTON_DELETE_GAME })
    ).toBeInTheDocument();
  });

  it("should display the Back button if displayBoard is true", () => {
    const displayBoard = true;

    renderGameHistorical({ displayBoard });

    expect(
      screen.getByRole("link", { name: mockDictionary.BUTTON_BACK })
    ).toBeInTheDocument();
  });

  it("should not display the Back button if displayBoard is false", () => {
    renderGameHistorical();

    expect(
      screen.queryByRole("link", { name: mockDictionary.BUTTON_BACK })
    ).not.toBeInTheDocument();
  });

  it("should route to the historial of the game component when clicking on the See Game button", () => {
    renderGameHistorical();

    const buttonSeeGame = screen.getByRole("link", {
      name: mockDictionary.BUTTON_SEE_GAME,
    });
    userEvent.click(buttonSeeGame);

    expect(buttonSeeGame).toHaveAttribute("href", `/historical/${gameId}`);
  });

  it("should route to the historial of the games component when clicking on the Back button", () => {
    const displayBoard = true;

    renderGameHistorical({ displayBoard });

    const buttonBack = screen.getByRole("link", {
      name: mockDictionary.BUTTON_BACK,
    });
    userEvent.click(buttonBack);

    expect(buttonBack).toHaveAttribute("href", `/historical`);
  });

  it("should call the delete game handler when displayBoard is false", () => {
    const { buttonDelete } = renderGameHistorical();

    userEvent.click(buttonDelete);
    expect(mockDeleteGame).toHaveBeenCalled();
  });

  it("should call the delete game handler when displayBoard is true", () => {
    const displayBoard = true;

    const { buttonDelete } = renderGameHistorical({ displayBoard });

    userEvent.click(buttonDelete);
    expect(mockDeleteGame).toHaveBeenCalled();
  });
});
