import "@testing-library/jest-dom/extend-expect";
import {
  changeCategory,
  changeComputerImage,
  changeDisabled,
  changeFirst,
  changeLevel,
  changeOver,
  changeResult,
  changeUserImage,
  changeWinners,
} from "../../actions/game";
import { Action } from "../../actions/types";
import { State } from "../../contexts/game/GameContext";
import gameReducer from "../../reducers/gameReducer";
import {
  Categories,
  GameResult,
  ImageName,
  Player,
  PlayingLevel,
} from "../../types";

describe("gameReducer", () => {
  const IMAGES_PER_CATEGORY = 20;

  const initialState: State = {
    category: {
      id: 5,
      folder: "soccer",
      name: "CATEGORY_SOCCER_PLAYERS",
    },
    userImage: Math.floor(Math.random() * IMAGES_PER_CATEGORY) as ImageName,
    computerImage: Math.floor(Math.random() * IMAGES_PER_CATEGORY) as ImageName,
    first: Player.User,
    level: PlayingLevel.Easy,
    disabled: true,
    over: false,
    result: GameResult.Started,
    winners: [1, 2, 3],
  };

  it("should return the initial state", () => {
    expect(gameReducer(initialState, {} as Action)).toEqual(initialState);
  });

  it("should change the category", () => {
    const category: Categories = {
      id: 0,
      folder: "habana",
      name: "CATEGORY_HAVANA_LANDMARKS",
    };

    expect(gameReducer(initialState, changeCategory(category))).toEqual({
      ...initialState,
      category: {
        ...category,
      },
    });
  });

  it("should change the disable status", () => {
    const disabled = false;

    expect(gameReducer(initialState, changeDisabled(disabled))).toEqual({
      ...initialState,
      disabled,
    });
  });

  it("should change the player who plays first", () => {
    const first = Player.Computer;

    expect(gameReducer(initialState, changeFirst(first))).toEqual({
      ...initialState,
      first,
    });
  });

  it("should change the user image", () => {
    let userImage = 10 as ImageName;
    while (userImage === initialState.userImage) {
      userImage = Math.floor(Math.random() * IMAGES_PER_CATEGORY) as ImageName;
    }

    expect(gameReducer(initialState, changeUserImage(userImage))).toEqual({
      ...initialState,
      userImage,
    });
  });

  it("should change the computer image", () => {
    let computerImage = 11 as ImageName;
    while (computerImage === initialState.computerImage) {
      computerImage = Math.floor(
        Math.random() * IMAGES_PER_CATEGORY
      ) as ImageName;
    }

    expect(
      gameReducer(initialState, changeComputerImage(computerImage))
    ).toEqual({
      ...initialState,
      computerImage,
    });
  });

  it("should change the computer playing level", () => {
    const level = PlayingLevel.Smart;

    expect(gameReducer(initialState, changeLevel(level))).toEqual({
      ...initialState,
      level,
    });
  });

  it("should change the game over status", () => {
    const over = true;

    expect(gameReducer(initialState, changeOver(over))).toEqual({
      ...initialState,
      over,
    });
  });

  it("should change the game result", () => {
    const result = GameResult.Won;

    expect(gameReducer(initialState, changeResult(result))).toEqual({
      ...initialState,
      result,
    });
  });

  it("should change the game winning squares", () => {
    const winners = [4, 5, 6];

    expect(gameReducer(initialState, changeWinners(winners))).toEqual({
      ...initialState,
      winners,
    });
  });
});
