import {
  Categories,
  FirstPlayer,
  GameResult,
  ImageName,
  PlayingLevel,
  SquareLocation,
} from "../types";

import {
  CategoryAction,
  ComputerImageAction,
  DisabledAction,
  FirstAction,
  GameOverAction,
  PlayingLevelAction,
  ResultAction,
  UserImageAction,
  WinnersSquaresAction,
} from "./types";

export const CHANGE_CATEGORY = "CHANGE_CATEGORY";
export const CHANGE_DISABLED = "CHANGE_DISABLED";
export const CHANGE_FIRST = "CHANGE_FIRST";
export const CHANGE_IMAGES = "CHANGE_IMAGES";
export const CHANGE_USER_IMAGE = "CHANGE_USER_IMAGE";
export const CHANGE_COMPUTER_IMAGE = "CHANGE_COMPUTER_IMAGE";
export const CHANGE_PLAYING_LEVEL = "CHANGE_PLAYING_LEVEL";
export const CHANGE_GAME_OVER = "CHANGE_GAME_OVER";
export const CHANGE_GAME_RESULT = "CHANGE_GAME_RESULT";
export const CHANGE_WINNERS_SQUARES = "CHANGE_WINNERS_SQUARES";

export const changeCategory = (category: Categories): CategoryAction => {
  return {
    type: CHANGE_CATEGORY,
    category,
  };
};

export const changeDisabled = (disabled: boolean): DisabledAction => {
  return {
    type: CHANGE_DISABLED,
    disabled,
  };
};

export const changeFirst = (first: FirstPlayer): FirstAction => {
  return {
    type: CHANGE_FIRST,
    first,
  };
};

export const changeUserImage = (userImage: ImageName): UserImageAction => {
  return {
    type: CHANGE_USER_IMAGE,
    userImage,
  };
};

export const changeComputerImage = (
  computerImage: ImageName
): ComputerImageAction => {
  return {
    type: CHANGE_COMPUTER_IMAGE,
    computerImage,
  };
};

export const changeLevel = (level: PlayingLevel): PlayingLevelAction => {
  return {
    type: CHANGE_PLAYING_LEVEL,
    level,
  };
};

export const changeOver = (over: boolean): GameOverAction => {
  return {
    type: CHANGE_GAME_OVER,
    over,
  };
};

export const changeResult = (result: GameResult): ResultAction => {
  return {
    type: CHANGE_GAME_RESULT,
    result,
  };
};

export const changeWinners = (
  winners: SquareLocation[]
): WinnersSquaresAction => {
  return {
    type: CHANGE_WINNERS_SQUARES,
    winners,
  };
};
