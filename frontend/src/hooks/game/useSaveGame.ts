import axios from "axios";
import { useCallback, useState } from "react";
import { DBGame } from "../../types";
import useMounted from "../useMounted";

function useSaveGame(token: string) {
  const isMounted = useMounted();
  const [error, setError] = useState("");

  const updateState = useCallback(
    (newError: string) => {
      if (isMounted()) {
        setError(newError);
      }
    },
    [isMounted]
  );

  const handleSaveGame = useCallback(
    async (game: DBGame) => {
      try {
        await axios.post("http://localhost:4000/api/games/", game, {
          headers: { Authorization: `Bearer ${token}` },
        });

        updateState("");
      } catch (e) {
        updateState("Error while saving the game info to the database");
      }
    },
    [token, updateState]
  );

  return { error, handleSaveGame };
}

export default useSaveGame;
