import { useCallback } from "react";
import { changeDisabled } from "../../actions/game";
import { Action } from "../../actions/types";

function useGameStart(dispatch: React.Dispatch<Action>) {
  const handleGameStart = useCallback(() => {
    dispatch(changeDisabled(true));
  }, [dispatch]);

  return { handleGameStart };
}

export default useGameStart;
