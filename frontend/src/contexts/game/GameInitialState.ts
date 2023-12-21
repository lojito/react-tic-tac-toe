import categories from "../../assets/json/categories.json";
import { State } from "../../contexts/game/GameContext";
import {
  Categories,
  GameResult,
  ImageName,
  Player,
  PlayingLevel,
} from "../../types";

const NUMBER_OF_CATEGORIES = 10;
const category = categories[
  Math.floor(Math.random() * NUMBER_OF_CATEGORIES)
] as Categories;

const IMAGES_PER_CATEGORY = 20;
const userImage = Math.floor(Math.random() * IMAGES_PER_CATEGORY) as ImageName;
let computerImage = Math.floor(
  Math.random() * IMAGES_PER_CATEGORY
) as ImageName;

const initialState: State = {
  category,
  userImage,
  computerImage,
  first: Player.User,
  level: PlayingLevel.Easy,
  disabled: false,
  over: false,
  result: GameResult.Started,
  winners: [],
};

export default initialState;
