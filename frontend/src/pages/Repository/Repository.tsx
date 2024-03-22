import React, { FC, useContext } from "react";
import { GameContext } from "../../contexts/game/GameContext";
import Category from "../../components/Category/Category";
import "./Repository.scss";

const Repository: FC = () => {
  const { game } = useContext(GameContext);
  const folder = game.category.folder;
  const url = `${process.env.PUBLIC_URL}/images`;

  return (
    <div className="repository" data-testid="repository">
      <Category />
      <div className="repository-images" data-testid="images">
        {Array(~~20)
          .fill(1)
          .map((value, index) => {
            return (
              <div key={`image-${index}`}>
                <img src={`${url}/${folder}/${index}.jpg`} alt="user" />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Repository;
