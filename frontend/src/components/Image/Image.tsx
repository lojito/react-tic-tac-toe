import React, { FC, memo, useContext, useEffect } from "react";
import { changeComputerImage, changeUserImage } from "../../actions/game";
import { Action } from "../../actions/types";
import {
  DictionaryContext,
  DictionaryEntry,
} from "../../contexts/dictionary/DictionaryContext";
import { GameContext } from "../../contexts/game/GameContext";
import useImages from "../../hooks/useImages";
import { ImageFolder, ImageName } from "../../types";
import "./Image.scss";

interface Props {
  disabled: boolean;
  folder: ImageFolder;
  user: ImageName;
  computer: ImageName;
  dispatch: React.Dispatch<Action>;
  dictionary: DictionaryEntry;
}

const MemoizedImage: FC<Props> = memo(
  ({ disabled, folder, user, computer, dispatch, dictionary }) => {
    const url = `${process.env.PUBLIC_URL}/images`;
    const backendUrl = "http://localhost:4000/images";
    const { images, handleRefreshImage } = useImages(user, computer);
    const { user: userImage, computer: computerImage } = images;

    useEffect(() => {
      if (userImage !== user) {
        dispatch(changeUserImage(userImage));
      } else if (computerImage !== computer) {
        dispatch(changeComputerImage(computerImage));
      } else {
        return;
      }
    }, [userImage, computerImage, user, computer, dispatch]);

    const imgClassName = `refresh ${disabled ? " disabled" : ""}`;

    return (
      <div className="images" data-testid="images">
        <div className="user-image">
          <span>{dictionary.IMAGE_USER_LABEL}: </span>
          <img
            className="image-token"
            src={`${backendUrl}/${folder}/${userImage}.jpg`}
            alt="user"
            title={dictionary.IMAGE_USER_TOOLTIP}
          />
          <img
            className={imgClassName}
            id="user"
            src={`${url}/refresh.png`}
            alt="refresh-user-img"
            onClick={(e) => handleRefreshImage(e)}
            title={dictionary.IMAGE_REFRESH_TOOLTIP}
          />
        </div>

        <div className="computer-image">
          <span>{dictionary.IMAGE_COMPUTER_LABEL}: </span>
          <img
            className="image-token"
            src={`${backendUrl}/${folder}/${computerImage}.jpg?`}
            alt="computer"
            title={dictionary.IMAGE_COMPUTER_TOOLTIP}
          />
          <img
            className={imgClassName}
            id="computer"
            src={`${url}/refresh.png`}
            alt="refresh-computer-img"
            onClick={(e) => handleRefreshImage(e)}
            title={dictionary.IMAGE_REFRESH_TOOLTIP}
          />
        </div>
      </div>
    );
  }
);

const Image: FC = () => {
  const { dictionary } = useContext(DictionaryContext);
  const { game, dispatch } = useContext(GameContext);
  const folder = game.category.folder;
  //const { user, computer } = game.images;
  const user = game.userImage;
  const computer = game.computerImage;

  return (
    <MemoizedImage
      disabled={game.disabled}
      folder={folder}
      user={user}
      computer={computer}
      dispatch={dispatch}
      dictionary={dictionary}
    />
  );
};

export default Image;
