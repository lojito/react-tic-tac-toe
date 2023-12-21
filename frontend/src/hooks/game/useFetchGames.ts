import axios from "axios";
import { useCallback, useState } from "react";
import { DBGame } from "../../types";
import useMounted from "../useMounted";

interface FetchedGames {
  games: DBGame[] | null;
  error: boolean;
  isFetching: boolean;
}

function useFetchGames(token: string) {
  const isMounted = useMounted();
  const [state, setState] = useState<FetchedGames>({
    games: null,
    error: false,
    isFetching: false,
  });

  const updateState = useCallback(
    (newState: FetchedGames) => {
      if (isMounted()) {
        setState({ ...newState });
      }
    },
    [isMounted]
  );

  const handleFetchGames = useCallback(async () => {
    try {
      updateState({ games: null, error: false, isFetching: true });
      const res = await axios.get("http://localhost:4000/api/games", {
        headers: { Authorization: `Bearer ${token}` },
      });
      updateState({ games: res.data, error: false, isFetching: false });
    } catch (e) {
      updateState({
        games: null,
        error: true,
        isFetching: false,
      });
    }
  }, [token, updateState]);

  const handleRemoveGame = useCallback(
    (gameId: string) => {
      if (state.games) {
        const newGames = state.games.filter((game) => game._id !== gameId);
        if (newGames.length !== state.games.length) {
          if (newGames.length === 0) {
            updateState({ games: null, error: false, isFetching: false });
          } else {
            updateState({ games: newGames, error: false, isFetching: false });
          }
        }
      }
    },
    [state.games, updateState]
  );

  return { ...state, handleFetchGames, handleRemoveGame };
}

export default useFetchGames;
