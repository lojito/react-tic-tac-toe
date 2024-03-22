import { useQuery } from "@apollo/client";
import React, { FC, useContext } from "react";
import { useParams } from "react-router-dom";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import GET_GAME from "../../queries/getGame";
import Historical from "../../components/Game/Historical";

interface Props {
  token: string;
}

const GameHistorical: FC<Props> = ({ token }) => {
  const { id } = useParams<{ id: string }>();

  const { loading, error, data } = useQuery(GET_GAME, {
    context: { headers: { Authorization: `Bearer ${token}` } },
    fetchPolicy: "no-cache",
    variables: { gameId: id },
  });

  const {
    dictionary: { HISTORICAL_FETCHING_GAME, HISTORICAL_FETCHING_GAME_ERROR },
  } = useContext(DictionaryContext);

  if (loading) {
    return <div className="info">{HISTORICAL_FETCHING_GAME}</div>;
  }

  if (error) {
    return <div className="info">{HISTORICAL_FETCHING_GAME_ERROR}</div>;
  }

  return (
    <div className="text-center">
      {data && data.game && (
        <Historical
          token={token}
          key={data.game._id}
          game={data.game}
          displayBoard
        />
      )}
    </div>
  );
};

export default GameHistorical;
