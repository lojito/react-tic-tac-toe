import React, { FC, memo, useContext, useEffect } from "react";
import { changeComputerImage, changeUserImage } from "../../actions/game";
import { Action } from "../../actions/types";
import refreshImage from "../../assets/images/refresh.png";
import {
  DictionaryContext,
  DictionaryEntry,
} from "../../contexts/dictionary/DictionaryContext";
import { GameContext } from "../../contexts/game/GameContext";
import useImages from "../../hooks/game/useImages";
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
    const { images, handleRefreshImage } = useImages(user, computer);
    const { user: userImage, computer: computerImage } = images;
    const {
      IMAGE_USER_LABEL,
      IMAGE_USER_TOOLTIP,
      IMAGE_REFRESH_TOOLTIP,
      IMAGE_COMPUTER_LABEL,
      IMAGE_COMPUTER_TOOLTIP,
    } = dictionary;
    useEffect(() => {
      if (userImage !== user) {
        dispatch(changeUserImage(userImage));
      } else if (computerImage !== computer) {
        dispatch(changeComputerImage(computerImage));
      }
    }, [userImage, computerImage, user, computer, dispatch]);

    const imgClassName = `refresh ${disabled ? " disabled" : ""}`;

    return (
      <div className="images" data-testid="images">
        <div className="user-image">
          <span>{IMAGE_USER_LABEL}: </span>
          <img
            className="image-token"
            src={`${url}/${folder}/${userImage}.jpg`}
            alt="user"
            title={IMAGE_USER_TOOLTIP}
          />
          <img
            className={imgClassName}
            id="user"
            src={refreshImage}
            alt="refresh-user-img"
            onClick={(e) => handleRefreshImage(e)}
            title={IMAGE_REFRESH_TOOLTIP}
          />
        </div>

        <div className="computer-image">
          <span>{IMAGE_COMPUTER_LABEL}: </span>
          <img
            className="image-token"
            src={`${url}/${folder}/${computerImage}.jpg?`}
            alt="computer"
            title={IMAGE_COMPUTER_TOOLTIP}
          />
          <img
            className={imgClassName}
            id="computer"
            src={refreshImage}
            alt="refresh-computer-img"
            onClick={(e) => handleRefreshImage(e)}
            title={IMAGE_REFRESH_TOOLTIP}
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
