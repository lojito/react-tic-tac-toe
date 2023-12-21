import axios from "axios";
import { useCallback, useState } from "react";
import useMounted from "../useMounted";

interface DeleteGame {
  gameId: string;
  error: boolean;
}

function useDeleteGame(token: string) {
  const isMounted = useMounted();
  const [state, setState] = useState<DeleteGame>({
    gameId: "",
    error: false,
  });

  const updateState = useCallback(
    (newState: DeleteGame) => {
      if (isMounted()) {
        setState({ ...newState });
      }
    },
    [isMounted]
  );

  const handleDeleteGame = useCallback(
    async (gameId: string) => {
      try {
        await axios.delete(`http://localhost:4000/api/games/${gameId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        updateState({
          gameId,
          error: false,
        });
      } catch (e) {
        updateState({
          gameId,
          error: true,
        });
      }
    },
    [token, updateState]
  );

  return { ...state, handleDeleteGame };
}

export default useDeleteGame;
