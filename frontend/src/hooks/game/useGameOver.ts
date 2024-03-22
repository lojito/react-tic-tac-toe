import { useCallback } from "react";
import { changeOver, changeResult, changeWinners } from "../../actions/game";
import { Action } from "../../actions/types";
import { DBGame } from "../../types";

function useGameOver(dispatch: React.Dispatch<Action>) {
  const handleGameOver = useCallback(
    (game: DBGame) => {
      dispatch(changeResult(game.result));
      dispatch(changeOver(true));
      dispatch(changeWinners(game.winners));
    },
    [dispatch]
  );

  return { handleGameOver };
}

export default useGameOver;
