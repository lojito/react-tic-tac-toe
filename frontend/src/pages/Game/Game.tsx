import { useMutation } from "@apollo/client";
import React, { FC, useCallback, useContext, useEffect } from "react";
import BoardUI from "../../components/BoardUI/BoardUI";
import Category from "../../components/Category/Category";
import Image from "../../components/Image/Image";
import PlayingLevel from "../../components/PlayingLevel/PlayingLevel";
import StartGame from "../../components/StartGame/StartGame";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import { GameContext } from "../../contexts/game/GameContext";
import useGameInit from "../../hooks/game/useGameInit";
import useGameOver from "../../hooks/game/useGameOver";
import useGameStart from "../../hooks/game/useGameStart";
import ADD_GAME from "../../mutations/addGame";
import GET_GAMES from "../../queries/getGames";
import { DBGame, GameResult } from "../../types";
import "./Game.scss";

interface Props {
  token: string;
  name: string;
}

const Game: FC<Props> = ({ token, name }) => {
  const {
    dictionary: {
      WELCOME_BACK,
      GAME_OVER,
      MESSAGE_LOST,
      MESSAGE_WON,
      MESSAGE_DRAW,
      BUTTON_PLAY,
      BUTTON_PLAY_AGAIN,
      GAME_SAVING,
      GAME_SAVE_ERROR,
    },
  } = useContext(DictionaryContext);
  const { game, dispatch: dispatchGame } = useContext(GameContext);
  const { handleGameInit } = useGameInit(dispatchGame);
  const { handleGameStart } = useGameStart(dispatchGame);
  const { handleGameOver } = useGameOver(dispatchGame);

  const context = { headers: { Authorization: `Bearer ${token}` } };
  const [addGame, { loading, error }] = useMutation(ADD_GAME, {
    context,
    refetchQueries: [{ query: GET_GAMES, context }],
  });

  const handleGameCompletion = useCallback(
    async (game: DBGame) => {
      handleGameOver(game);
      addGame({ variables: { ...game } });
    },
    [handleGameOver, addGame]
  );

  useEffect(() => {
    return () => {
      handleGameInit();
    };
  }, [handleGameInit]);

  return (
    <div className="game text-center" data-testid="game">
      <div className="welcome-back">
        {`${WELCOME_BACK}, ${name[0].toUpperCase()}${name
          .slice(1)
          .toLowerCase()}`}
      </div>

      <Category />

      <Image />

      <div className="settings">
        <StartGame />
        <PlayingLevel />
      </div>

      <BoardUI onGameOver={handleGameCompletion} />

      <div className="board-footer">
        {game.over ? (
          <>
            <span>{GAME_OVER}: </span>
            <span>
              {game.result === GameResult.Lost
                ? MESSAGE_LOST
                : game.result === GameResult.Won
                ? MESSAGE_WON
                : MESSAGE_DRAW}
            </span>
          </>
        ) : null}

        {!game.over && (
          <button
            disabled={game.disabled}
            className="play-again"
            onClick={handleGameStart}
            aria-label="play"
          >
            {BUTTON_PLAY}
          </button>
        )}

        {game.over && (
          <button
            className="play-again"
            onClick={handleGameInit}
            aria-label="play"
          >
            {BUTTON_PLAY_AGAIN}
          </button>
        )}

        {loading && <div>{GAME_SAVING}</div>}

        {error && <div className="info">{GAME_SAVE_ERROR}</div>}
      </div>
    </div>
  );
};

export default Game;
