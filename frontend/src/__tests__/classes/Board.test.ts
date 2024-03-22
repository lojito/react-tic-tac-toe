import { Board } from "../../classes/Board";
import { SQUARES_NUMBER, SQUARE_NOT_FOUND } from "../../classes/constants";
import { Player, PlayingLevel, SquareLocation } from "../../types";

let board: Board;

beforeEach(() => {
  board = new Board();
});

it("should create an empty board", () => {
  expect(board.isEmpty).toBeTruthy();
});

it("should create an board of 9 squares", () => {
  expect(board.getBoard()).toHaveLength(SQUARES_NUMBER);
});

it("should set level to PlayingLevel.Easy", () => {
  expect(board.level).toBe(PlayingLevel.Easy);
});

it("should set level to PlayingLevel.Smart", () => {
  board.level = PlayingLevel.Smart;

  expect(board.level).toBe(PlayingLevel.Smart);
});

it("should set the starting player to be the user", () => {
  board.first = Player.User;

  expect(board.first).toBe(Player.User);
});

it("should set the starting player to be the computer", () => {
  board.first = Player.Computer;

  expect(board.first).toBe(Player.Computer);
});

it("should set the number of moves to 0", () => {
  expect(board.moves).toBe(0);
});

it("should not have any empty square", () => {
  board.place(Player.User, SquareLocation.TopLeft);
  board.place(Player.Computer, SquareLocation.TopCenter);
  board.place(Player.User, SquareLocation.TopRight);
  board.place(Player.Computer, SquareLocation.MiddleLeft);
  board.place(Player.User, SquareLocation.MiddleCenter);
  board.place(Player.Computer, SquareLocation.MiddleRight);
  board.place(Player.User, SquareLocation.BottomLeft);
  board.place(Player.Computer, SquareLocation.BottomCenter);
  board.place(Player.User, SquareLocation.BottomRight);

  expect(board.isFull).toBeTruthy();
});

it("should have some empty squares", () => {
  board.place(Player.User, SquareLocation.TopLeft);
  board.place(Player.User, SquareLocation.MiddleCenter);
  board.place(Player.User, SquareLocation.BottomRight);

  const result = board.emptySquares;

  expect(result).toEqual([
    SquareLocation.TopCenter,
    SquareLocation.TopRight,
    SquareLocation.MiddleLeft,
    SquareLocation.MiddleRight,
    SquareLocation.BottomLeft,
    SquareLocation.BottomCenter,
  ]);
});

it("should reset the board", () => {
  board.place(Player.User, SquareLocation.TopLeft);
  board.place(Player.User, SquareLocation.MiddleCenter);
  board.place(Player.User, SquareLocation.BottomRight);

  board.reset();

  expect(board.isEmpty).toBeTruthy();
});

it("should place player on a square", () => {
  board.place(Player.User, SquareLocation.MiddleRight);

  expect(board.getBoard()[SquareLocation.MiddleRight]).toBe(Player.User);
});

it("should decrement the number of moves", () => {
  board.place(Player.Computer, SquareLocation.TopLeft);
  const moves = board.moves;

  board.place(Player.Nobody, SquareLocation.TopLeft);

  expect(board.moves).toBe(moves - 1);
});

it("should expect the user to be about to win the game", () => {
  board.place(Player.User, SquareLocation.TopLeft);
  board.place(Player.Computer, SquareLocation.TopCenter);
  board.place(Player.User, SquareLocation.MiddleCenter);
  board.place(Player.Computer, SquareLocation.MiddleLeft);

  expect(board.canWinInOneMove(Player.User)).not.toBe(SQUARE_NOT_FOUND);

  board.reset();

  board.place(Player.User, SquareLocation.TopLeft);
  board.place(Player.Computer, SquareLocation.MiddleRight);
  board.place(Player.User, SquareLocation.TopRight);
  board.place(Player.Computer, SquareLocation.MiddleLeft);

  expect(board.canWinInOneMove(Player.User)).not.toBe(SQUARE_NOT_FOUND);

  board.reset();

  board.place(Player.User, SquareLocation.TopCenter);
  board.place(Player.Computer, SquareLocation.MiddleRight);
  board.place(Player.User, SquareLocation.TopRight);
  board.place(Player.Computer, SquareLocation.MiddleLeft);

  expect(board.canWinInOneMove(Player.User)).not.toBe(SQUARE_NOT_FOUND);
});

it("should not expect the user to be about to win the game", () => {
  board.place(Player.User, SquareLocation.TopLeft);

  expect(board.canWinInOneMove(Player.User)).toBe(SQUARE_NOT_FOUND);
});

it("should expect to win in two moves single", () => {
  const arrSquares = [
    [SquareLocation.TopLeft, SquareLocation.TopCenter, SquareLocation.TopRight],
    [SquareLocation.TopCenter, SquareLocation.TopLeft, SquareLocation.TopRight],
    [SquareLocation.TopRight, SquareLocation.TopLeft, SquareLocation.TopCenter],
  ];

  for (const squares of arrSquares) {
    const [square0, square1, square2] = squares;
    board.place(Player.User, square0);

    const result = board.canWinInTwoMovesSingle(Player.User);

    expect(
      result.filter((value) => [square1, square2].includes(value))
    ).toEqual([square1, square2]);

    board.reset();
  }
});

it("should not expect to win in two moves single", () => {
  board.place(Player.Computer, SquareLocation.TopLeft);
  board.place(Player.User, SquareLocation.TopCenter);
  board.place(Player.Computer, SquareLocation.MiddleCenter);
  board.place(Player.User, SquareLocation.MiddleLeft);

  expect(board.canWinInTwoMovesSingle(Player.User)).toEqual([]);
});

it("should expect to win in two moves double", () => {
  board.place(Player.User, SquareLocation.TopCenter);
  board.place(Player.Computer, SquareLocation.MiddleCenter);
  board.place(Player.User, SquareLocation.MiddleLeft);
  board.place(Player.Computer, SquareLocation.BottomCenter);

  const result = board.canWinInTwoMovesDouble(Player.User);

  expect(
    result.filter((value) => [SquareLocation.TopLeft].includes(value))
  ).toEqual([SquareLocation.TopLeft]);
});

it("should not expect to win in two moves double", () => {
  board.place(Player.Computer, SquareLocation.TopLeft);
  board.place(Player.User, SquareLocation.TopCenter);
  board.place(Player.Computer, SquareLocation.MiddleCenter);
  board.place(Player.User, SquareLocation.MiddleLeft);

  expect(board.canWinInTwoMovesDouble(Player.User)).toEqual([]);
});

it("should expect the user to be the winner of the game", () => {
  board.place(Player.User, SquareLocation.TopLeft);
  board.place(Player.Computer, SquareLocation.MiddleLeft);
  board.place(Player.User, SquareLocation.TopCenter);
  board.place(Player.Computer, SquareLocation.MiddleCenter);
  board.place(Player.User, SquareLocation.TopRight);

  expect(board.isAWinner(Player.User)).not.toEqual([]);
});

it("should expect the game to be a tie", () => {
  board.place(Player.Computer, SquareLocation.TopLeft);
  board.place(Player.User, SquareLocation.TopCenter);
  board.place(Player.Computer, SquareLocation.TopRight);
  board.place(Player.User, SquareLocation.MiddleLeft);
  board.place(Player.Computer, SquareLocation.MiddleCenter);
  board.place(Player.User, SquareLocation.MiddleRight);
  board.place(Player.User, SquareLocation.BottomLeft);
  board.place(Player.Computer, SquareLocation.BottomCenter);
  board.place(Player.User, SquareLocation.BottomRight);

  expect(board.isFull).toBeTruthy();
  expect(board.isAWinner(Player.User)).toEqual([]);
  expect(board.isAWinner(Player.Computer)).toEqual([]);
});

it("should expect winning squares on the board", () => {
  board.place(Player.User, SquareLocation.TopLeft);
  board.place(Player.Computer, SquareLocation.MiddleLeft);
  board.place(Player.User, SquareLocation.TopCenter);
  board.place(Player.Computer, SquareLocation.MiddleCenter);
  board.place(Player.User, SquareLocation.TopRight);

  expect(board.isAWinner(Player.User)).toEqual([
    SquareLocation.TopLeft,
    SquareLocation.TopCenter,
    SquareLocation.TopRight,
  ]);
});

it("should not expect winning squares on the board", () => {
  board.place(Player.User, SquareLocation.TopLeft);
  board.place(Player.Computer, SquareLocation.MiddleLeft);
  board.place(Player.User, SquareLocation.TopCenter);
  board.place(Player.Computer, SquareLocation.MiddleCenter);

  expect(board.isAWinner(Player.User)).toEqual([]);
});

it("should not expect Player.Nobody to be the winner", () => {
  expect(board.isAWinner(Player.Nobody)).toEqual([]);
});
