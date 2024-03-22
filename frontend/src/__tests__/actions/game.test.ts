import "@testing-library/jest-dom/extend-expect";
import {
  CHANGE_CATEGORY,
  CHANGE_COMPUTER_IMAGE,
  CHANGE_DISABLED,
  CHANGE_FIRST,
  CHANGE_GAME_OVER,
  CHANGE_GAME_RESULT,
  CHANGE_PLAYING_LEVEL,
  CHANGE_USER_IMAGE,
  CHANGE_WINNERS_SQUARES,
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
import {
  Categories,
  GameResult,
  ImageName,
  Player,
  PlayingLevel,
} from "../../types";

describe("Game actions creator", () => {
  it("should create the category action object", () => {
    const category: Categories = {
      id: 0,
      folder: "habana",
      name: "CATEGORY_HAVANA_LANDMARKS",
    };

    const CategoryAction = changeCategory(category);

    expect(CategoryAction).toEqual({
      type: CHANGE_CATEGORY,
      category: {
        ...category,
      },
    });
  });

  it("should create the disabled action object", () => {
    const disabled = false;

    const DisabledAction = changeDisabled(disabled);

    expect(DisabledAction).toEqual({
      type: CHANGE_DISABLED,
      disabled,
    });
  });

  it("should create the first move action object", () => {
    const first = Player.Computer;

    const FirstActionMove = changeFirst(first);

    expect(FirstActionMove).toEqual({
      type: CHANGE_FIRST,
      first,
    });
  });

  it("should create the user image action object", () => {
    const userImage: ImageName = 10;

    const UserImageAction = changeUserImage(userImage);

    expect(UserImageAction).toEqual({
      type: CHANGE_USER_IMAGE,
      userImage,
    });
  });

  it("should create the computer image action object", () => {
    const computerImage: ImageName = 11;

    const ComputerImageAction = changeComputerImage(computerImage);

    expect(ComputerImageAction).toEqual({
      type: CHANGE_COMPUTER_IMAGE,
      computerImage,
    });
  });

  it("should create the computer playing level action object", () => {
    const level = PlayingLevel.Smart;

    const actionLevel = changeLevel(level);

    expect(actionLevel).toEqual({
      type: CHANGE_PLAYING_LEVEL,
      level,
    });
  });

  it("should create the game over action object", () => {
    const over = true;

    const GameOverAction = changeOver(over);

    expect(GameOverAction).toEqual({
      type: CHANGE_GAME_OVER,
      over,
    });
  });

  it("should create the game result action object", () => {
    const result = GameResult.Won;

    const actionGameResult = changeResult(result);

    expect(actionGameResult).toEqual({
      type: CHANGE_GAME_RESULT,
      result,
    });
  });

  it("should create the winning squares action object", () => {
    const winners = [4, 5, 6];

    const WinnersSquaresActionquares = changeWinners(winners);

    expect(WinnersSquaresActionquares).toEqual({
      type: CHANGE_WINNERS_SQUARES,
      winners,
    });
  });
});
