import React, { FC, useContext } from "react";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import { ImageFolder, ImageName } from "../../types";
import "./Image.scss";

interface Props {
  folder: ImageFolder;
  userImage: ImageName;
  computerImage: ImageName;
}

const Historical: FC<Props> = ({ folder, userImage, computerImage }) => {
  const { dictionary } = useContext(DictionaryContext);
  const url = "http://localhost:4000/images";

  return (
    <div className="images historical" data-testid="images-historical">
      <div className="user-image">
        <span>{dictionary.IMAGE_USER_LABEL + ": "}</span>
        <img
          className="image-token"
          src={`${url}/${folder}/${userImage}.jpg`}
          alt="user"
        />
      </div>

      <div className="computer-image">
        <span>{dictionary.IMAGE_COMPUTER_LABEL + ": "}</span>
        <img
          className="image-token"
          src={`${url}/${folder}/${computerImage}.jpg`}
          alt="computer"
        />
      </div>
    </div>
  );
};

export default Historical;
