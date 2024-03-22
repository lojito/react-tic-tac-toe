import { Board } from "../../classes/Board";
import { Computer } from "../../classes/Computer";
import { Player, PlayingLevel, SquareLocation } from "../../types";

describe("Computer", () => {
  let board: Board;
  let computer: Computer;

  beforeEach(() => {
    board = new Board();
    computer = new Computer(board);
  });

  it("should expect the computer to play on the middle center square", () => {
    board.first = Player.User;
    board.level = PlayingLevel.Smart;
    board.place(Player.User, SquareLocation.TopLeft);

    computer.playForTheFirstTime();
    const squares = board.getBoard();

    expect(squares[SquareLocation.MiddleCenter]).toBe(Player.Computer);
  });

  it("should not expect the computer to play on the middle center square", () => {
    board.first = Player.User;
    board.level = PlayingLevel.Smart;
    board.place(Player.User, SquareLocation.MiddleCenter);

    computer.playForTheFirstTime();
    const squares = board.getBoard();

    expect([
      squares[SquareLocation.TopLeft],
      squares[SquareLocation.TopRight],
      squares[SquareLocation.BottomLeft],
      squares[SquareLocation.BottomRight],
    ]).toContain(Player.Computer);
  });

  it("should expect the computer to play on either the center square or one of the 4 corner squares", () => {
    board.first = Player.Computer;
    board.level = PlayingLevel.Smart;

    computer.playForTheFirstTime();
    const squares = board.getBoard();

    expect([
      squares[SquareLocation.MiddleCenter],
      squares[SquareLocation.TopLeft],
      squares[SquareLocation.TopRight],
      squares[SquareLocation.BottomLeft],
      squares[SquareLocation.BottomRight],
    ]).toContain(Player.Computer);
  });

  it("should expect the computer to play for the second time", () => {
    board.first = Player.Computer;
    board.level = PlayingLevel.Smart;
    board.place(Player.Computer, SquareLocation.MiddleCenter);
    board.place(Player.User, SquareLocation.TopLeft);
    jest.spyOn(global.Math, "random").mockReturnValueOnce(0.0528798980106473);
    computer.playForTheSecondTime();
    const squares = board.getBoard();

    expect([
      squares[SquareLocation.TopLeft],
      squares[SquareLocation.TopRight],
      squares[SquareLocation.BottomLeft],
      squares[SquareLocation.BottomRight],
    ]).toContain(Player.Computer);
  });

  it("should expect the computer to play for the second time when the user previously played on the middle center square", () => {
    board.first = Player.Computer;
    board.level = PlayingLevel.Smart;
    board.place(Player.Computer, SquareLocation.TopLeft);
    board.place(Player.User, SquareLocation.MiddleCenter);

    computer.playForTheSecondTime();
    const squares = board.getBoard();

    expect([
      squares[SquareLocation.TopCenter],
      squares[SquareLocation.TopRight],
      squares[SquareLocation.MiddleLeft],
      squares[SquareLocation.MiddleRight],
      squares[SquareLocation.BottomLeft],
      squares[SquareLocation.BottomCenter],
      squares[SquareLocation.BottomRight],
    ]).toContain(Player.Computer);
  });

  it("should expect the computer to play for the second time on the middle center square", () => {
    board.first = Player.Computer;
    board.level = PlayingLevel.Smart;
    board.place(Player.Computer, SquareLocation.TopLeft);
    board.place(Player.User, SquareLocation.TopCenter);

    computer.playForTheSecondTime();
    const squares = board.getBoard();

    expect(squares[SquareLocation.MiddleCenter]).toBe(Player.Computer);
  });

  it("should expect the computer to win on the next move", () => {
    board.first = Player.Computer;
    board.level = PlayingLevel.Smart;
    board.place(Player.Computer, SquareLocation.TopLeft);
    board.place(Player.User, SquareLocation.MiddleCenter);
    board.place(Player.Computer, SquareLocation.TopRight);

    computer.playAgain();
    const squares = board.getBoard();

    expect(squares[SquareLocation.TopCenter]).toBe(Player.Computer);
    expect(board.isAWinner(Player.Computer)).toBeTruthy();
  });

  it("should expect the user to win on the next move", () => {
    board.first = Player.User;
    board.level = PlayingLevel.Smart;
    board.place(Player.User, SquareLocation.TopLeft);
    board.place(Player.Computer, SquareLocation.MiddleCenter);
    board.place(Player.User, SquareLocation.TopRight);

    computer.playAgain();
    const squares = board.getBoard();

    expect(squares[SquareLocation.TopCenter]).toBe(Player.Computer);
  });

  it("should expect the computer to win in two moves in two different ways", () => {
    board.first = Player.Computer;
    board.level = PlayingLevel.Smart;
    board.place(Player.Computer, SquareLocation.MiddleCenter);
    board.place(Player.User, SquareLocation.TopRight);
    board.place(Player.Computer, SquareLocation.BottomLeft);
    board.place(Player.User, SquareLocation.BottomCenter);
    jest.spyOn(global.Math, "random").mockReturnValueOnce(0.29888451987787845);

    computer.playAgain();
    const squares = board.getBoard();

    expect(squares[SquareLocation.TopLeft]).toBe(Player.Computer);
  });

  it("should expect the computer to win in two moves in only one way", () => {
    board.first = Player.User;
    board.level = PlayingLevel.Smart;
    board.place(Player.User, SquareLocation.MiddleCenter);
    board.place(Player.Computer, SquareLocation.TopLeft);
    board.place(Player.User, SquareLocation.BottomRight);
    jest
      .spyOn(board, "canWinInTwoMovesSingle")
      .mockReturnValueOnce([
        SquareLocation.MiddleLeft,
        SquareLocation.TopRight,
      ]);

    computer.playAgain();
    const squares = board.getBoard();

    expect(squares[SquareLocation.MiddleLeft]).not.toBe(Player.Computer);
  });

  it("should expect the computer to play on any of the empty squares while playing again", () => {
    board.first = Player.User;
    board.level = PlayingLevel.Easy;
    board.place(Player.User, SquareLocation.MiddleCenter);
    board.place(Player.Computer, SquareLocation.TopLeft);
    board.place(Player.User, SquareLocation.BottomLeft);
    board.place(Player.Computer, SquareLocation.TopRight);
    board.place(Player.User, SquareLocation.TopCenter);
    board.place(Player.Computer, SquareLocation.BottomCenter);
    board.place(Player.User, SquareLocation.BottomRight);

    computer.playAgain();
    const squares = board.getBoard();

    expect([
      squares[SquareLocation.MiddleLeft],
      squares[SquareLocation.MiddleRight],
    ]).toContain(Player.Computer);
  });

  it("should expect the computer to play on any of the empty squares", () => {
    board.first = Player.Computer;
    board.level = PlayingLevel.Easy;
    board.place(Player.Computer, SquareLocation.TopLeft);
    board.place(Player.User, SquareLocation.MiddleLeft);
    const emptySquares = board.emptySquares;

    computer.playOnAnyEmptySquare();

    expect(emptySquares).toContain(Player.Computer);
  });

  it("should expect the computer to play smart having the user played only one time", () => {
    board.first = Player.User;
    board.level = PlayingLevel.Smart;
    board.place(Player.User, SquareLocation.MiddleLeft);

    computer.playSmart();

    const squares = board.getBoard();
    expect(squares[SquareLocation.MiddleCenter]).toBe(Player.Computer);
  });

  it("should expect the computer to play smart having the user played at least two times", () => {
    board.first = Player.User;
    board.level = PlayingLevel.Smart;
    board.place(Player.User, SquareLocation.TopLeft);
    board.place(Player.Computer, SquareLocation.MiddleCenter);
    board.place(Player.User, SquareLocation.BottomCenter);

    computer.playSmart();
    const squares = board.getBoard();

    expect([
      squares[SquareLocation.TopCenter],
      squares[SquareLocation.TopRight],
      squares[SquareLocation.MiddleLeft],
      squares[SquareLocation.MiddleRight],
      squares[SquareLocation.BottomLeft],
      squares[SquareLocation.BottomRight],
    ]).toContain(Player.Computer);
  });

  it("should expect the computer to play smart and for the first time", () => {
    board.first = Player.Computer;
    board.level = PlayingLevel.Smart;

    computer.playSmart();
    const squares = board.getBoard();

    expect([
      squares[SquareLocation.TopLeft],
      squares[SquareLocation.TopRight],
      squares[SquareLocation.MiddleCenter],
      squares[SquareLocation.BottomLeft],
      squares[SquareLocation.BottomRight],
    ]).toContain(Player.Computer);
  });

  it("should expect the computer to play smart and for the second time", () => {
    board.first = Player.Computer;
    board.level = PlayingLevel.Smart;
    board.place(Player.Computer, SquareLocation.MiddleCenter);
    board.place(Player.User, SquareLocation.TopLeft);

    computer.playSmart();
    const squares = board.getBoard();

    expect([
      squares[SquareLocation.TopLeft],
      squares[SquareLocation.TopRight],
      squares[SquareLocation.BottomLeft],
      squares[SquareLocation.BottomRight],
    ]).toContain(Player.Computer);
  });

  it("should expect the computer to play smart after the its second move", () => {
    board.first = Player.Computer;
    board.level = PlayingLevel.Smart;
    board.place(Player.Computer, SquareLocation.MiddleCenter);
    board.place(Player.User, SquareLocation.TopLeft);
    board.place(Player.Computer, SquareLocation.TopRight);
    board.place(Player.User, SquareLocation.MiddleLeft);

    computer.playSmart();
    const squares = board.getBoard();

    expect(squares[SquareLocation.BottomLeft]).toBe(Player.Computer);
  });

  it("should expect the computer to play smart", () => {
    board.first = Player.User;
    board.level = PlayingLevel.Smart;

    board.place(Player.User, SquareLocation.TopLeft);
    computer.play();
    const squares = board.getBoard();

    expect(squares[SquareLocation.TopLeft]).not.toBe(Player.Computer);
  });

  it("should expect the computer to play on any empty square", () => {
    board.first = Player.User;
    board.level = PlayingLevel.Easy;
    board.place(Player.User, SquareLocation.TopLeft);
    const emptySquares = board.emptySquares;

    computer.play();

    expect(emptySquares).toContain(Player.Computer);
  });
});
