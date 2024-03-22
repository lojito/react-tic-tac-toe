export type CategoryId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type ImageName =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19;

export type FirstPlayer = Player.User | Player.Computer;

export enum PlayingLevel {
  Easy,
  Smart,
}

export enum Player {
  User,
  Computer,
  Nobody,
}

export type GameBoard = [
  Player,
  Player,
  Player,
  Player,
  Player,
  Player,
  Player,
  Player,
  Player
];

export enum SquareLocation {
  TopLeft,
  TopCenter,
  TopRight,
  MiddleLeft,
  MiddleCenter,
  MiddleRight,
  BottomLeft,
  BottomCenter,
  BottomRight,
}

export enum GameResult {
  Draw,
  Lost,
  Started,
  Won,
}

export type DBGame = {
  _id?: string;
  board: GameBoard;
  categoryId: CategoryId;
  first: FirstPlayer;
  userImage: ImageName;
  computerImage: ImageName;
  level: PlayingLevel;
  result: GameResult;
  winners: SquareLocation[];
  user?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};
