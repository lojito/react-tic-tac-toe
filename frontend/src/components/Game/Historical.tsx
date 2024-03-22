import { useMutation } from "@apollo/client";
import React, { FC, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import categories from "../../data/json/categories.json";
import DELETE_GAME from "../../mutations/deleteGame";
import GET_GAMES from "../../queries/getGames";
import { Categories, DBGame, GameResult } from "../../types";
import BoardUI from "../BoardUI/Historical";
import Category from "../Category/Historical";
import Images from "../Image/Historical";
import PlayingLevel from "../PlayingLevel/Historical";
import StartGame from "../StartGame/Historical";
import "./Game.scss";

interface Props {
  token: string;
  game: DBGame;
  displayBoard: boolean;
}

const Historical: FC<Props> = ({ game, displayBoard, token }) => {
  const history = useHistory();
  const {
    dictionary: {
      MESSAGE_LOST,
      MESSAGE_WON,
      MESSAGE_DRAW,
      BUTTON_SEE_GAME,
      BUTTON_BACK,
      BUTTON_DELETE_GAME,
      GAME_DELETING,
      GAME_DELETE_ERROR,
    },
  } = useContext(DictionaryContext);

  const context = { headers: { Authorization: `Bearer ${token}` } };
  const [deleteGame, { data, loading, error }] = useMutation(DELETE_GAME, {
    context,
    refetchQueries: [{ query: GET_GAMES, context }],
  });

  const {
    categoryId,
    computerImage,
    userImage,
    first,
    level,
    board,
    winners,
    result,
  } = game;

  const id = game._id!;

  const handleDeleteGame = async (gameId: string) => {
    deleteGame({ variables: { gameId: gameId } });
  };

  useEffect(() => {
    if (data) {
      history.push("/historical");
    }
  }, [data, history]);

  return (
    <div className="game-wrapper">
      <Category categoryId={categoryId} />

      <Images
        userImage={userImage}
        computerImage={computerImage}
        folder={(categories as Categories[])[categoryId].folder}
      />

      <div className="settings">
        <StartGame first={first} />
        <PlayingLevel level={level} />
      </div>

      {displayBoard ? (
        <BoardUI
          userImage={userImage}
          computerImage={computerImage}
          board={board}
          winners={winners}
          folder={(categories as Categories[])[categoryId].folder}
        />
      ) : null}

      <div className="board-footer">
        <span>
          {result === GameResult.Lost
            ? MESSAGE_LOST
            : result === GameResult.Won
            ? MESSAGE_WON
            : MESSAGE_DRAW}
        </span>

        <div className="buttons">
          {!displayBoard ? (
            <button className="see-game">
              <Link to={`/historical/${id}`}>{BUTTON_SEE_GAME}</Link>
            </button>
          ) : null}

          {displayBoard ? (
            <button className="back">
              <Link to="/historical">{BUTTON_BACK}</Link>
            </button>
          ) : null}

          <button
            className="delete-game"
            onClick={() => {
              handleDeleteGame(id);
            }}
          >
            {BUTTON_DELETE_GAME}
          </button>
        </div>

        {loading && <div>{GAME_DELETING}</div>}

        {error && <div className="info">{GAME_DELETE_ERROR}</div>}
      </div>

      {!displayBoard ? <hr /> : null}
    </div>
  );
};

export default Historical;
