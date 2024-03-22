import { act, renderHook } from "@testing-library/react-hooks";
import board from "../../../classes/Board";
import computer from "../../../classes/Computer";
import { State } from "../../../contexts/game/GameContext";
import useBoard from "../../../hooks/game/useBoard";
import { FirstPlayer, GameResult, Player, PlayingLevel } from "../../../types";

describe("useBoard", () => {
  const renderUseBoard = (
    disabled: boolean,
    over: boolean,
    first: FirstPlayer = Player.User,
    winners: number[] = []
  ) => {
    const game = {
      category: {
        id: 5,
        folder: "soccer",
        name: "CATEGORY_SOCCER_PLAYERS",
      },
      userImage: 5,
      computerImage: 6,
      first,
      level: PlayingLevel.Easy,
      disabled,
      over,
      result: GameResult.Started,
      winners,
    } as State;

    const onGameOver = jest.fn();

    const utils = renderHook(
      ({ game, onGameOver }) => useBoard(game, onGameOver),
      { initialProps: { game, onGameOver } }
    );

    return { ...utils, game, onGameOver };
  };

  it("should not let the user nor computer play yet", () => {
    const disabled = true;
    const over = false;
    const mockBoardPlace = jest.fn();

    jest.spyOn(board, "place").mockImplementationOnce(mockBoardPlace);
    renderUseBoard(disabled, over);

    expect(mockBoardPlace).not.toHaveBeenCalled();
  });

  it("should let the user play", () => {
    const disabled = true;
    const over = false;
    const square = 0;
    const mockBoardPlace = jest.fn();

    jest.spyOn(board, "place").mockImplementationOnce(mockBoardPlace);
    const { result } = renderUseBoard(disabled, over);
    act(() => {
      result.current.playGame(square);
    });

    expect(mockBoardPlace).toHaveBeenCalled();
  });

  it("should let the computer play", () => {
    const disabled = false;
    const over = false;
    const first = Player.Computer;
    const mockComputerPlay = jest.fn();

    jest.spyOn(computer, "play").mockImplementationOnce(mockComputerPlay);
    const { rerender, game, onGameOver } = renderUseBoard(
      disabled,
      over,
      first
    );
    game.disabled = true;
    rerender({ game, onGameOver });

    expect(mockComputerPlay).toHaveBeenCalled();
  });

  it("should let the user win the game", () => {
    const disabled = true;
    const over = false;
    const square = 0;
    const mockBoardIsWinner = jest.fn(() => [0, 1, 2]);

    jest.spyOn(board, "isAWinner").mockImplementationOnce(mockBoardIsWinner);
    const { result } = renderUseBoard(disabled, over);
    act(() => {
      result.current.playGame(square);
    });

    expect(mockBoardIsWinner).toHaveBeenCalled();
  });

  it("should let the computer win the game", () => {
    const disabled = false;
    const over = false;
    const first = Player.Computer;
    const mockBoardIsWinner = jest.fn(() => [0, 1, 2]);

    jest.spyOn(board, "isAWinner").mockImplementationOnce(mockBoardIsWinner);
    const { rerender, game, onGameOver } = renderUseBoard(
      disabled,
      over,
      first
    );
    game.disabled = true;
    rerender({ game, onGameOver });

    expect(mockBoardIsWinner).toHaveBeenCalled();
  });

  it("should let the game be over", () => {
    const disabled = true;
    const over = false;
    const square = 0;
    const mockBoardIsWinner = jest.fn(() => [0, 1, 2]);

    jest.spyOn(board, "isAWinner").mockImplementationOnce(mockBoardIsWinner);
    const { result, rerender, game, onGameOver } = renderUseBoard(
      disabled,
      over
    );
    act(() => {
      result.current.playGame(square);
    });

    game.disabled = false;
    rerender({ game, onGameOver });

    expect(onGameOver).toHaveBeenCalled();
  });

  it("should end the game because the board is full", () => {
    const disabled = true;
    const over = false;
    const square = 0;
    const mockBoardIsFull = jest.fn(() => true);

    jest.spyOn(board, "isFull", "get").mockImplementationOnce(mockBoardIsFull);
    const { result } = renderUseBoard(disabled, over);
    act(() => {
      result.current.playGame(square);
    });

    expect(mockBoardIsFull).toHaveBeenCalled();
  });

  it("should reset the UI board after finishing playing one game", () => {
    const disabled = true;
    const over = false;
    const square = 0;
    const mockBoardIsWinner = jest.fn(() => [0, 1, 2]);

    jest.spyOn(board, "isAWinner").mockImplementationOnce(mockBoardIsWinner);
    const { result, rerender, game, onGameOver } = renderUseBoard(
      disabled,
      over
    );
    act(() => {
      result.current.playGame(square);
    });

    game.disabled = false;
    rerender({ game, onGameOver });

    game.disabled = true;
    rerender({ game, onGameOver });

    expect(result.current.gameBoard).toEqual([...Array(9).fill(Player.Nobody)]);
  });

  it("should not let the end continue when it is over", () => {
    const disabled = true;
    const over = false;
    const square = 3;
    const mockBoardIsWinner = jest.fn(() => [0, 1, 2]);
    const mockBoardPlace = jest.fn();

    jest.spyOn(board, "isAWinner").mockImplementationOnce(mockBoardIsWinner);
    jest.spyOn(board, "place").mockImplementationOnce(mockBoardPlace);
    const { result } = renderUseBoard(disabled, over);
    act(() => {
      result.current.playGame(square);
    });
    act(() => {
      result.current.playGame(square);
    });

    expect(mockBoardPlace).toHaveBeenCalledTimes(1);
  });
});
