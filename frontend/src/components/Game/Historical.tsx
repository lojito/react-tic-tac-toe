import React, { useContext, FC } from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import Category from "../Category/Historical";
import Images from "../Image/Historical";
import StartGame from "../StartGame/Historical";
import PlayingLevel from "../PlayingLevel/Historical";
import BoardUI from "../BoardUI/Historical";
import { GameResult, DBGame, Categories } from "../../types";
import "./Game.scss";
import categories from "../../assets/json/categories.json";

interface Props extends RouteComponentProps {
  game: DBGame;
  displayBoard: boolean;
  onDeleteGame: () => void;
}

const Historical: FC<Props> = ({ game, displayBoard, onDeleteGame }) => {
  const { dictionary } = useContext(DictionaryContext);

  let id: string,
    categoryId,
    computerImage,
    userImage,
    first,
    level,
    board,
    winners,
    result;

  ({
    categoryId,
    computerImage,
    userImage,
    first,
    level,
    board,
    winners,
    result,
  } = game);

  id = game._id!;

  return (
    <div className="gameWrapper">
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
            ? dictionary.MESSAGE_LOST
            : result === GameResult.Won
            ? dictionary.MESSAGE_WON
            : dictionary.MESSAGE_DRAW}
        </span>

        <div className="buttons">
          {!displayBoard ? (
            <button className="see-game">
              <Link to={`/historical/${id}`}>{dictionary.BUTTON_SEE_GAME}</Link>
            </button>
          ) : null}

          <button name="delete-game" onClick={async () => await onDeleteGame()}>
            {dictionary.BUTTON_DELETE_GAME}
          </button>

          {displayBoard ? (
            <button className="back">
              <Link to={"/historical"}>{dictionary.BUTTON_BACK}</Link>
            </button>
          ) : null}
        </div>
      </div>

      {!displayBoard ? <hr /> : null}
    </div>
  );
};

export default withRouter(Historical);
