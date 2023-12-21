import React, { FC, useContext, useEffect } from "react";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import useDeleteGame from "../../hooks/game/useDeleteGame";
import useFetchGames from "../../hooks/game/useFetchGames";
import Historical from "../Game/Historical";

import { DBGame } from "../../types";

interface Props {
  token: string;
}

const GamesHistorical: FC<Props> = ({ token }) => {
  const { dictionary } = useContext(DictionaryContext);
  const {
    games,
    error: errorFetchingGames,
    isFetching,
    handleFetchGames,
    handleRemoveGame,
  } = useFetchGames(token);
  const {
    gameId,
    error: errorDeletingGame,
    handleDeleteGame,
  } = useDeleteGame(token);

  useEffect(() => {
    handleFetchGames();
  }, [handleFetchGames]);

  useEffect(() => {
    if (gameId && !errorDeletingGame) {
      handleRemoveGame(gameId);
    }
  }, [handleRemoveGame, gameId, errorDeletingGame]);

  if (isFetching) {
    return <div className="info">{dictionary.HISTORICAL_FETCHING_GAMES}</div>;
  }

  if (errorFetchingGames) {
    return (
      <div className="info">{dictionary.HISTORICAL_FETCHING_GAMES_ERROR}</div>
    );
  }

  if (!games || games.length === 0) {
    return <div className="info">{dictionary.HISTORICAL_NO_DATA_YET}</div>;
  }

  return (
    <div className="text-center">
      {errorDeletingGame ? (
        <div className="info">{dictionary.GAME_DELETE_ERROR}</div>
      ) : (
        ""
      )}
      {games.map((game: DBGame) => {
        return (
          <Historical
            key={game._id}
            game={game}
            displayBoard={false}
            onDeleteGame={async () => {
              await handleDeleteGame(game._id!);
            }}
          />
        );
      })}
    </div>
  );
};

export default GamesHistorical;
