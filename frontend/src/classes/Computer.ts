import { Player, PlayingLevel, SquareLocation } from "../types";
import board, { Board } from "./Board";
import { SQUARE_NOT_FOUND } from "./constants";

export class Computer {
  constructor(private board: Board) {}

  playForTheFirstTime = () => {
    const board = this.board.getBoard();
    if (this.board.isEmpty) {
      this.board.place(
        Player.Computer,
        [
          SquareLocation.TopLeft,
          SquareLocation.TopRight,
          SquareLocation.BottomLeft,
          SquareLocation.BottomRight,
          SquareLocation.MiddleCenter,
        ][Math.floor(Math.random() * 5)]
      );
    } else {
      this.board.place(
        Player.Computer,
        board[SquareLocation.MiddleCenter] === Player.User
          ? [
              SquareLocation.TopLeft,
              SquareLocation.TopRight,
              SquareLocation.BottomLeft,
              SquareLocation.BottomRight,
            ][Math.floor(Math.random() * 4)]
          : SquareLocation.MiddleCenter
      );
    }
  };

  playForTheSecondTime = () => {
    const board = this.board.getBoard();

    if (board[SquareLocation.MiddleCenter] === Player.Computer) {
      let square = [
        SquareLocation.TopLeft,
        SquareLocation.TopRight,
        SquareLocation.BottomLeft,
        SquareLocation.BottomRight,
      ][Math.floor(Math.random() * 4)];

      while (board[square] !== Player.Nobody) {
        square = [
          SquareLocation.TopLeft,
          SquareLocation.TopRight,
          SquareLocation.BottomLeft,
          SquareLocation.BottomRight,
        ][Math.floor(Math.random() * 4)];
      }

      this.board.place(Player.Computer, square);
    } else if (board[SquareLocation.MiddleCenter] === Player.User) {
      this.playOnAnyEmptySquare();
    } else {
      this.board.place(Player.Computer, SquareLocation.MiddleCenter);
    }
  };

  playAgain = () => {
    let square: SquareLocation | -1;
    let squares: SquareLocation[];

    square = this.board.canWinInOneMove(Player.Computer);
    if (square !== SQUARE_NOT_FOUND) {
      this.board.place(Player.Computer, square);
      return;
    }

    square = this.board.canWinInOneMove(Player.User);
    if (square !== SQUARE_NOT_FOUND) {
      this.board.place(Player.Computer, square);
      return;
    }

    squares = this.board.canWinInTwoMovesDouble(Player.Computer);
    if (squares.length > 0) {
      this.board.place(
        Player.Computer,
        squares[Math.floor(Math.random() * squares.length)]
      );
      return;
    }

    squares = this.board.canWinInTwoMovesSingle(Player.Computer);
    for (const square of squares) {
      this.board.place(Player.Computer, square);
      const squareComputer: SquareLocation | -1 = this.board.canWinInOneMove(
        Player.Computer
      );
      let squaresUser = this.board.canWinInTwoMovesDouble(Player.User);
      if (
        squaresUser.length > 0 &&
        squareComputer !== -1 &&
        squaresUser.indexOf(squareComputer) !== -1
      ) {
        this.board.place(Player.Nobody, square);
      } else {
        return;
      }
    }

    this.playOnAnyEmptySquare();
  };

  playSmart = () => {
    const moves = this.board.moves;

    if (this.board.first === Player.User) {
      if (moves === 1) {
        this.playForTheFirstTime();
      } else {
        this.playAgain();
      }
    } else if (this.board.isEmpty) {
      this.playForTheFirstTime();
    } else if (moves === 2) {
      this.playForTheSecondTime();
    } else {
      this.playAgain();
    }
  };

  playOnAnyEmptySquare = () => {
    const emptySquares = this.board.emptySquares;

    this.board.place(
      Player.Computer,
      emptySquares[Math.floor(Math.random() * emptySquares.length)]
    );
  };

  play = () => {
    const level = this.board.level;

    if (level === PlayingLevel.Smart) {
      this.playSmart();
    } else {
      this.playOnAnyEmptySquare();
    }
  };
}

const computer = new Computer(board);
export default computer;
