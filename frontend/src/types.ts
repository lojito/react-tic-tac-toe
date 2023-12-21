export type CategoryId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type CategoryHavanaLandmarks = {
  id: 0;
  name: "CATEGORY_HAVANA_LANDMARKS";
  folder: "habana";
};

export type CategoryMontrealLandmarks = {
  id: 1;
  name: "CATEGORY_MONTREAL_LANDMARKS";
  folder: "montreal";
};

export type CategoryVancouverLandmarks = {
  id: 2;
  name: "CATEGORY_VANCOUVER_LANDMARKS";
  folder: "vancouver";
};

export type CategorySpainLandmarks = {
  id: 3;
  name: "CATEGORY_SPAIN_LANDMARKS";
  folder: "spain";
};

export type CategoryGermanyLandmarks = {
  id: 4;
  name: "CATEGORY_GERMANY_LANDMARKS";
  folder: "germany";
};

export type CategorySoccerPlayers = {
  id: 5;
  name: "CATEGORY_SOCCER_PLAYERS";
  folder: "soccer";
};

export type CategoryFruitsAndVegetables = {
  id: 6;
  name: "CATEGORY_FRUITS_AND_VEGETABLES";
  folder: "fruits";
};

export type CategoryAnimals = {
  id: 7;
  name: "CATEGORY_ANIMALS";
  folder: "animals";
};

export type CategoryPuppies = {
  id: 8;
  name: "CATEGORY_PUPPIES";
  folder: "puppies";
};

export type CategorySeinfeld = {
  id: 9;
  name: "CATEGORY_SEINFELD";
  folder: "seinfeld";
};

export type Categories =
  | CategoryAnimals
  | CategoryFruitsAndVegetables
  | CategoryGermanyLandmarks
  | CategoryHavanaLandmarks
  | CategoryMontrealLandmarks
  | CategoryPuppies
  | CategorySeinfeld
  | CategorySoccerPlayers
  | CategorySpainLandmarks
  | CategoryVancouverLandmarks;

export type ImageFolder =
  | "habana"
  | "montreal"
  | "vancouver"
  | "spain"
  | "germany"
  | "soccer"
  | "fruits"
  | "animals"
  | "puppies"
  | "seinfeld";

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

export type SquareBoard = {
  disabled: boolean;
  id: string;
  imagePath: string;
  className: "win" | "";
};

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
