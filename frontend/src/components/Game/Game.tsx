import React, { FC, useCallback, useContext, useEffect } from "react";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import { GameContext } from "../../contexts/game/GameContext";
import useSaveGame from "../../hooks/game/useSaveGame";
import useGameInit from "../../hooks/useGameInit";
import useGameOver from "../../hooks/useGameOver";
import useGameStart from "../../hooks/useGameStart";
import { DBGame, GameResult } from "../../types";
import BoardUI from "../BoardUI/BoardUI";
import Category from "../Category/Category";
import Image from "../Image/Image";
import PlayingLevel from "../PlayingLevel/PlayingLevel";
import StartGame from "../StartGame/StartGame";
import "./Game.scss";

interface Props {
  token: string;
  name: string;
}

const Game: FC<Props> = ({ token, name }) => {
  const { dictionary } = useContext(DictionaryContext);
  const { game, dispatch: dispatchGame } = useContext(GameContext);
  const { handleGameInit } = useGameInit(dispatchGame);
  const { handleGameStart } = useGameStart(dispatchGame);
  const { handleGameOver } = useGameOver(dispatchGame);
  const { handleSaveGame, error } = useSaveGame(token);

  const handleGameCompletion = useCallback(
    (game: DBGame) => {
      handleGameOver(game);
      handleSaveGame(game);
    },
    [handleGameOver, handleSaveGame]
  );

  useEffect(() => {
    return () => {
      handleGameInit();
    };
  }, [handleGameInit]);

  return (
    <div className="game text-center" data-testid="game">
      <div className="welcome-back">
        {dictionary.WELCOME_BACK}
        {", "}
        {name[0].toUpperCase() + name.slice(1).toLowerCase()}
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
            <span>{dictionary.GAME_OVER}: </span>
            <span>
              {game.result === GameResult.Lost
                ? dictionary.MESSAGE_LOST
                : game.result === GameResult.Won
                ? dictionary.MESSAGE_WON
                : dictionary.MESSAGE_DRAW}
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
            {dictionary.BUTTON_PLAY}
          </button>
        )}

        {game.over && (
          <button
            className="play-again"
            onClick={handleGameInit}
            aria-label="play"
          >
            {dictionary.BUTTON_PLAY_AGAIN}
          </button>
        )}

        <div>{error}</div>
      </div>
    </div>
  );
};

export default Game;
