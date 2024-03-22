import {
  Categories,
  FirstPlayer,
  GameResult,
  ImageName,
  PlayingLevel,
  SquareLocation,
} from "../types";

export type CategoryAction = {
  type: "CHANGE_CATEGORY";
  category: Categories;
};

export type DisabledAction = {
  type: "CHANGE_DISABLED";
  disabled: boolean;
};

export type FirstAction = {
  type: "CHANGE_FIRST";
  first: FirstPlayer;
};

export type UserImageAction = {
  type: "CHANGE_USER_IMAGE";
  userImage: ImageName;
};

export type ComputerImageAction = {
  type: "CHANGE_COMPUTER_IMAGE";
  computerImage: ImageName;
};

export type PlayingLevelAction = {
  type: "CHANGE_PLAYING_LEVEL";
  level: PlayingLevel;
};

export type GameOverAction = {
  type: "CHANGE_GAME_OVER";
  over: boolean;
};

export type ResultAction = {
  type: "CHANGE_GAME_RESULT";
  result: GameResult;
};

export type WinnersSquaresAction = {
  type: "CHANGE_WINNERS_SQUARES";
  winners: SquareLocation[];
};

export type ActionUnknow = {
  type: "UNKNOWN";
};

export type Action =
  | CategoryAction
  | DisabledAction
  | FirstAction
  | UserImageAction
  | ComputerImageAction
  | PlayingLevelAction
  | GameOverAction
  | ResultAction
  | WinnersSquaresAction
  | ActionUnknow;
