import { useQuery } from "@apollo/client";
import React, { FC, useContext } from "react";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import GET_GAMES from "../../queries/getGames";
import { DBGame } from "../../types";
import Historical from "../../components/Game/Historical";

interface Props {
  token: string;
}

const GamesHistorical: FC<Props> = ({ token }) => {
  const { loading, error, data } = useQuery(GET_GAMES, {
    context: { headers: { Authorization: `Bearer ${token}` } },
    fetchPolicy: "no-cache",
  });
  const {
    dictionary: {
      HISTORICAL_FETCHING_GAMES,
      HISTORICAL_FETCHING_GAMES_ERROR,
      HISTORICAL_NO_DATA_YET,
    },
  } = useContext(DictionaryContext);

  if (loading) {
    return <div className="info">{HISTORICAL_FETCHING_GAMES}</div>;
  }

  if (error) {
    return <div className="info">{HISTORICAL_FETCHING_GAMES_ERROR}</div>;
  }

  if (data && data.games && data.games.length === 0) {
    return <div className="info">{HISTORICAL_NO_DATA_YET}</div>;
  }

  return (
    <div className="text-center">
      {data &&
        data.games &&
        data.games.map((game: DBGame) => {
          return (
            <Historical
              token={token}
              key={game._id}
              game={game}
              displayBoard={false}
            />
          );
        })}
    </div>
  );
};

export default GamesHistorical;
