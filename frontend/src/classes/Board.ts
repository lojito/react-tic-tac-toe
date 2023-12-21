import { PlayingLevel, Player, GameBoard, SquareLocation } from "../types";
import {
  SQUARES_NUMBER,
  SQUARE_NOT_FOUND,
  ROWS_OF_SQUARES,
  ROWS_OF_SQUARES_DOUBLE,
} from "./constants";

export class Board {
  private board: GameBoard;
  private _moves = 0;

  constructor(
    private _first = Player.User,
    private _level = PlayingLevel.Easy
  ) {
    this.board = Array(SQUARES_NUMBER).fill(Player.Nobody) as GameBoard;
  }

  get level() {
    return this._level;
  }

  set level(level) {
    this._level = level;
  }

  get first() {
    return this._first;
  }

  set first(first) {
    this._first = first;
  }

  get moves() {
    return this._moves;
  }

  get isFull() {
    return !this.board.includes(Player.Nobody);
  }

  get isEmpty() {
    return !(
      this.board.includes(Player.Computer) || this.board.includes(Player.User)
    );
  }

  get emptySquares() {
    return this.board.reduce(
      (squares: SquareLocation[], player, square: SquareLocation) => {
        if (player === Player.Nobody) {
          squares.push(square);
        }
        return squares;
      },
      []
    );
  }

  reset() {
    this.board.fill(Player.Nobody);
    this._moves = 0;
  }

  getBoard() {
    return [...this.board] as GameBoard;
  }

  place(player: Player, square: SquareLocation) {
    this.board[square] = player;
    if (player !== Player.Nobody) {
      this._moves++;
    } else {
      this._moves--;
    }

    return true;
  }

  isAWinner(player: Player) {
    if (player === Player.Nobody) {
      return [];
    }

    const arrSquares = ROWS_OF_SQUARES;
    let square0, square1, square2: SquareLocation;
    for (const squares of arrSquares) {
      [square0, square1, square2] = squares;

      if (
        this.board[square0] === player &&
        this.board[square1] === player &&
        this.board[square2] === player
      ) {
        return squares;
      }
    }

    return [];
  }

  is_placed_twice_in_a_row_of_squares(
    player: Player,
    square1: SquareLocation,
    square2: SquareLocation,
    emptySquare: SquareLocation
  ) {
    return (
      this.board[square1] === player &&
      this.board[square2] === player &&
      this.board[emptySquare] === Player.Nobody
    );
  }

  canWinInOneMove(player: Player) {
    const arrSquares = ROWS_OF_SQUARES;

    let square0, square1, square2: SquareLocation;

    for (const squares of arrSquares) {
      [square0, square1, square2] = squares;

      if (
        this.is_placed_twice_in_a_row_of_squares(
          player,
          square0,
          square1,
          square2
        )
      ) {
        return square2;
      }

      if (
        this.is_placed_twice_in_a_row_of_squares(
          player,
          square0,
          square2,
          square1
        )
      ) {
        return square1;
      }

      if (
        this.is_placed_twice_in_a_row_of_squares(
          player,
          square1,
          square2,
          square0
        )
      ) {
        return square0;
      }
    }

    return SQUARE_NOT_FOUND;
  }

  is_placed_once_in_a_row_of_squares(
    player: Player,
    square: SquareLocation,
    emptySquare1: SquareLocation,
    emptySquare2: SquareLocation
  ) {
    return (
      this.board[square] === player &&
      this.board[emptySquare1] === Player.Nobody &&
      this.board[emptySquare2] === Player.Nobody
    );
  }

  canWinInTwoMovesSingle = (player: Player) => {
    const result = [];

    let square0, square1, square2: SquareLocation;

    for (const squares of ROWS_OF_SQUARES) {
      [square0, square1, square2] = squares;

      if (
        this.is_placed_once_in_a_row_of_squares(
          player,
          square0,
          square1,
          square2
        )
      ) {
        result.push(square1);
        result.push(square2);
      }

      if (
        this.is_placed_once_in_a_row_of_squares(
          player,
          square1,
          square0,
          square2
        )
      ) {
        result.push(square0);
        result.push(square2);
      }

      if (
        this.is_placed_once_in_a_row_of_squares(
          player,
          square2,
          square0,
          square1
        )
      ) {
        result.push(square0);
        result.push(square1);
      }
    }

    return result;
  };

  canWinInTwoMovesDouble = (player: Player) => {
    const result = [];

    let square0, square1, square2, square3, square4: SquareLocation;

    for (const squares of ROWS_OF_SQUARES_DOUBLE) {
      [square0, square1, square2, square3, square4] = squares;

      if (
        (this.is_placed_once_in_a_row_of_squares(
          player,
          square2,
          square0,
          square1
        ) ||
          this.is_placed_once_in_a_row_of_squares(
            player,
            square1,
            square0,
            square2
          )) &&
        (this.is_placed_once_in_a_row_of_squares(
          player,
          square3,
          square0,
          square4
        ) ||
          this.is_placed_once_in_a_row_of_squares(
            player,
            square4,
            square0,
            square3
          ))
      ) {
        result.push(square0);
      }
    }

    return result;
  };
}

const board = new Board();
export default board;
