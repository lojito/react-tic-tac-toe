import React, { FC, useMemo, useReducer } from "react";
import gameReducer from "../../reducers/gameReducer";
import { GameContext } from "./GameContext";
import initialState from "./GameInitialState";

const GameContextProvider: FC = ({ children }) => {
  const [game, dispatch] = useReducer(gameReducer, initialState);
  const value = useMemo(() => {
    return { game, dispatch };
  }, [game]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export default GameContextProvider;
