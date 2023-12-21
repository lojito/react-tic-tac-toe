import React, { FC, useContext } from "react";
import categories from "../../assets/json/categories.json";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import { Categories, CategoryId } from "../../types";
import "./Category.scss";

interface Props {
  categoryId: CategoryId;
}

const Historical: FC<Props> = ({ categoryId }) => {
  const { dictionary } = useContext(DictionaryContext);

  return (
    <div className="categories" data-testid="categories">
      {dictionary.CATEGORY}:{" "}
      {dictionary[(categories as Categories[])[categoryId].name]}
    </div>
  );
};

export default Historical;
