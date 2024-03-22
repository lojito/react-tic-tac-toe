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
  const {
    dictionary: { IMAGE_USER_LABEL, IMAGE_COMPUTER_LABEL },
  } = useContext(DictionaryContext);
  const url = `${process.env.PUBLIC_URL}/images`;

  return (
    <div className="images historical" data-testid="images-historical">
      <div className="user-image">
        <span>{`${IMAGE_USER_LABEL}: `}</span>
        <img
          className="image-token"
          src={`${url}/${folder}/${userImage}.jpg`}
          alt="user"
        />
      </div>

      <div className="computer-image">
        <span>{`${IMAGE_COMPUTER_LABEL}: `}</span>
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
