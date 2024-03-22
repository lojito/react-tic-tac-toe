import React, { FC, memo } from "react";
import defaultImage from "../../assets/images/default.jpg";
import { SquareBoard } from "../../types";
import "./Square.scss";

const Square: FC<SquareBoard> = memo(
  ({ disabled, id, imagePath, className }) => {
    let url;
    if (imagePath === "default") {
      url = `url(${defaultImage}`;
    } else {
      url = `url(${process.env.PUBLIC_URL}/images/${imagePath}.jpg)`;
    }

    return (
      <button
        className={className}
        disabled
        id={id}
        style={{ backgroundImage: url }}
        aria-label="historical"
      />
    );
  }
);

export default Square;
