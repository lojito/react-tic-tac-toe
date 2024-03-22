import { useCallback } from "react";
import { changeDisabled, changeOver, changeResult } from "../../actions/game";
import { Action } from "../../actions/types";
import { GameResult } from "../../types";

function useGameInit(dispatch: React.Dispatch<Action>) {
  const handleGameInit = useCallback(() => {
    dispatch(changeOver(false));
    dispatch(changeDisabled(false));
    dispatch(changeResult(GameResult.Started));
  }, [dispatch]);

  return { handleGameInit };
}

export default useGameInit;
