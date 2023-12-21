import React, { FC, memo, useContext } from "react";
import { changeCategory } from "../../actions/game";
import { Action } from "../../actions/types";
import categories from "../../assets/json/categories.json";
import {
  DictionaryContext,
  DictionaryEntry,
} from "../../contexts/dictionary/DictionaryContext";
import { GameContext } from "../../contexts/game/GameContext";
import { Categories, CategoryId } from "../../types";
import "./Category.scss";

interface Props {
  disabled: boolean;
  categoryId: CategoryId;
  dispatch: React.Dispatch<Action>;
  categories: Categories[];
  dictionary: DictionaryEntry;
}

const MemoizedCategory: FC<Props> = memo(
  ({ disabled, categoryId, dispatch, categories, dictionary }) => {
    return (
      <div className="categories" data-testid="categories">
        <label htmlFor="categories">{dictionary.CATEGORY}: </label>
        <select
          id="categories"
          defaultValue={categoryId}
          onChange={(e) => {
            dispatch(changeCategory(categories[+e.target.value]));
          }}
          disabled={disabled}
        >
          {categories.map((category: Categories) => {
            return (
              <option key={category.name} value={category.id}>
                {dictionary[category.name]}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
);

const Category: FC = () => {
  const { dictionary } = useContext(DictionaryContext);
  const { game, dispatch } = useContext(GameContext);

  return (
    <MemoizedCategory
      disabled={game.disabled}
      categoryId={game.category.id}
      dispatch={dispatch}
      categories={categories as Categories[]}
      dictionary={dictionary}
    />
  );
};

export default Category;
