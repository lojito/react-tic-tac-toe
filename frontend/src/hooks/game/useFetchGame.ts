import axios from "axios";
import { useCallback, useState } from "react";
import { DBGame } from "../../types";
import useMounted from "../useMounted";

interface FetchedGame {
  game: DBGame | null;
  error: boolean;
  isFetching: boolean;
}

function useFetchGame(token: string) {
  const isMounted = useMounted();
  const [state, setState] = useState<FetchedGame>({
    game: null,
    error: false,
    isFetching: false,
  });

  const updateState = useCallback(
    (newState: FetchedGame) => {
      if (isMounted()) {
        setState({ ...newState });
      }
    },
    [isMounted]
  );

  const handleFetchGame = useCallback(
    async (gameId: string) => {
      try {
        updateState({ game: null, error: false, isFetching: true });
        const res = await axios.get(
          `http://localhost:4000/api/games/${gameId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        updateState({ game: res.data, error: false, isFetching: false });
      } catch (e) {
        updateState({
          game: null,
          error: true,
          isFetching: false,
        });
      }
    },
    [token, updateState]
  );

  return { ...state, handleFetchGame };
}

export default useFetchGame;
