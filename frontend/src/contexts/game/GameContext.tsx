import React, { createContext } from "react";
import { Action } from "../../actions/types";
import {
  Categories,
  FirstPlayer,
  GameResult,
  ImageName,
  PlayingLevel,
  SquareLocation,
} from "../../types";

export type State = {
  category: Categories;
  userImage: ImageName;
  computerImage: ImageName;
  first: FirstPlayer;
  level: PlayingLevel;
  disabled: boolean;
  over: boolean;
  result: GameResult;
  winners: SquareLocation[];
};

export const GameContext = createContext<{
  game: State;
  dispatch: React.Dispatch<Action>;
}>({ game: {} as State, dispatch: {} as React.Dispatch<Action> });
