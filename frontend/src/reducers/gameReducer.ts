import { State } from "../contexts/game/GameContext";

import { Action } from "../actions/types";

import {
  CHANGE_CATEGORY,
  CHANGE_COMPUTER_IMAGE,
  CHANGE_DISABLED,
  CHANGE_FIRST,
  CHANGE_GAME_OVER,
  CHANGE_GAME_RESULT,
  CHANGE_PLAYING_LEVEL,
  CHANGE_USER_IMAGE,
  CHANGE_WINNERS_SQUARES,
} from "../actions/game";

const gameReducer = (state: State, action: Action) => {
  const newState: State = {
    ...state,
    category: {
      ...state.category,
    },
  };

  switch (action.type) {
    case CHANGE_CATEGORY:
      return {
        ...newState,
        category: {
          ...action.category,
        },
      };

    case CHANGE_DISABLED:
      return {
        ...newState,
        disabled: action.disabled,
      };

    case CHANGE_FIRST:
      return {
        ...newState,
        first: action.first,
      };

    case CHANGE_USER_IMAGE:
      return {
        ...newState,
        userImage: action.userImage,
      };

    case CHANGE_COMPUTER_IMAGE:
      return {
        ...newState,
        computerImage: action.computerImage,
      };

    case CHANGE_PLAYING_LEVEL:
      return {
        ...newState,
        level: action.level,
      };

    case CHANGE_GAME_OVER:
      return {
        ...newState,
        over: action.over,
      };

    case CHANGE_GAME_RESULT:
      return {
        ...newState,
        result: action.result,
      };

    case CHANGE_WINNERS_SQUARES:
      return {
        ...newState,
        winners: action.winners,
      };

    default:
      return state;
  }
};

export default gameReducer;
