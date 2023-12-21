import React, { FC, memo } from "react";
import { SquareBoard } from "../../types";
import "./Square.scss";

const Square: FC<SquareBoard> = memo(
  ({ disabled, id, imagePath, className }) => {
    let url;
    if (imagePath === "default") {
      url = `url(${process.env.PUBLIC_URL}/images/default.jpg)`;
    } else {
      url = `url(http://localhost:4000/images/${imagePath}.jpg)`;
    }

    return (
      <button
        className={className}
        disabled={true}
        id={id}
        style={{ backgroundImage: url }}
      ></button>
    );
  }
);

export default Square;
