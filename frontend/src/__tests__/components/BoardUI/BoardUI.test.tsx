import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BoardUI from "../../../components/BoardUI/BoardUI";
import { GameContext, State } from "../../../contexts/game/GameContext";
import useBoard from "../../../hooks/game/useBoard";
import { GameBoard, GameResult, Player, PlayingLevel } from "../../../types";

jest.mock(
  "../../../components/Square/Square",
  () =>
    ({
      disabled,
      id,
      imagePath,
      className,
    }: {
      disabled: boolean;
      id: string;
      imagePath: string;
      className: string;
    }) => {
      const path = `url(${process.env.PUBLIC_URL}/images`;
      const url =
        imagePath === "default"
          ? `${path}/default.jpg)`
          : `${path}/${imagePath}.jpg)`;

      return (
        <button
          id={id}
          data-testid={`square-${id}`}
          className={className}
          disabled={disabled}
          style={{ backgroundImage: url }}
        >
          {id}
        </button>
      );
    }
);

jest.mock("../../../hooks/game/useBoard");

describe("BoardUI", () => {
  const mockPlayGame = jest.fn();

  const emptyBoard: GameBoard = [
    Player.Nobody,
    Player.Nobody,
    Player.Nobody,
    Player.Nobody,
    Player.Nobody,
    Player.Nobody,
    Player.Nobody,
    Player.Nobody,
    Player.Nobody,
  ];

  interface Props {
    disabled?: boolean;
    over?: boolean;
    board?: GameBoard;
    winners?: number[];
  }

  const renderBoard = ({
    disabled = false,
    over = false,
    board = emptyBoard,
    winners = [],
  }: Props = {}) => {
    const game = {
      category: {
        id: 5,
        folder: "soccer",
        name: "CATEGORY_SOCCER_PLAYERS",
      },
      userImage: 5,
      computerImage: 6,
      first: Player.User,
      level: PlayingLevel.Easy,
      disabled,
      over,
      result: GameResult.Started,
      winners,
    } as State;

    (useBoard as jest.Mock).mockReturnValue({
      gameBoard: board,
      playGame: mockPlayGame,
    });

    const dispatch = jest.fn();
    const handleGameOver = jest.fn();

    const utils = render(
      <GameContext.Provider value={{ game, dispatch }}>
        <BoardUI onGameOver={handleGameOver} />
      </GameContext.Provider>
    );

    return { ...utils, mockPlayGame };
  };

  it("should render the BoardUI component correctly", () => {
    const { asFragment } = renderBoard();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should render the wrapper div with class board", () => {
    renderBoard();

    expect(screen.queryByTestId("board")).toHaveClass("board");
  });

  it("should render the board when disabled is true", async () => {
    const user = userEvent.setup();
    renderBoard({ disabled: true });
    const firstSquare = screen.queryByTestId("square-0");

    await user.click(firstSquare!);

    expect(mockPlayGame).toHaveBeenCalled();
  });

  it("should render the board when over is true", async () => {
    const user = userEvent.setup();
    const over = true;
    const board: GameBoard = [
      Player.Computer,
      Player.Computer,
      Player.Computer,
      Player.User,
      Player.User,
      Player.Computer,
      Player.User,
      Player.User,
      Player.Computer,
    ];
    const winners = [0, 1, 2];
    renderBoard({ over, board, winners });
    const firstSquare = screen.queryByTestId("square-0");

    await user.click(firstSquare!);

    expect(mockPlayGame).not.toHaveBeenCalled();
  });

  it("should call the click handler", async () => {
    const user = userEvent.setup();
    const disabled = true;
    renderBoard({ disabled });
    const firstSquare = screen.queryByTestId("square-0");

    await user.click(firstSquare!);

    expect(mockPlayGame).toHaveBeenCalled();
  });
});
