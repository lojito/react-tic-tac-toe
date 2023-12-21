import React, { FC, useContext, useEffect } from "react";
import { RouteComponentProps, match } from "react-router-dom";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import useDeleteGame from "../../hooks/game/useDeleteGame";
import useFetchGame from "../../hooks/game/useFetchGame";
import Historical from "../Game/Historical";

interface AuditCompareRouteParams {
  id: string;
}

interface Props {
  match?: match<AuditCompareRouteParams>;
  token: string;
  history: RouteComponentProps["history"];
}

const GameHistorical: FC<Props> = ({ token, match, history }) => {
  const { dictionary } = useContext(DictionaryContext);
  const {
    game,
    error: errorFetchingGame,
    isFetching,
    handleFetchGame,
  } = useFetchGame(token);
  const {
    gameId,
    error: errorDeletingGame,
    handleDeleteGame,
  } = useDeleteGame(token);

  useEffect(() => {
    handleFetchGame(match!.params.id);
  }, [handleFetchGame, match]);

  useEffect(() => {
    if (gameId && !errorDeletingGame) {
      history!.push("/historical");
    }
  }, [gameId, errorDeletingGame, history]);

  if (isFetching) {
    return <div className="info">{dictionary.HISTORICAL_FETCHING_GAME}</div>;
  }

  if (errorFetchingGame) {
    return (
      <div className="info">{dictionary.HISTORICAL_FETCHING_GAME_ERROR}</div>
    );
  }

  if (!game) {
    return <div className="info">{dictionary.HISTORICAL_NO_DATA_YET}</div>;
  }

  return (
    <div className="text-center">
      {errorDeletingGame ? (
        <div className="info">{dictionary.GAME_DELETE_ERROR}</div>
      ) : (
        ""
      )}
      <Historical
        key={game._id}
        game={game}
        displayBoard={true}
        onDeleteGame={async () => {
          await handleDeleteGame(game._id!);
        }}
      />
    </div>
  );
};

export default GameHistorical;
