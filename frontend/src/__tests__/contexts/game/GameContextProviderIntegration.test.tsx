import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useContext } from "react";
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
} from "../../../actions/game";
import { GameContext, State } from "../../../contexts/game/GameContext";
import GameContextProvider from "../../../contexts/game/GameContextProvider";
import {
  Categories,
  GameResult,
  ImageName,
  Player,
  PlayingLevel,
} from "../../../types";

describe("GameContextProvider", () => {
  let categories: Categories[];
  let newState: State;
  const IMAGES_PER_CATEGORY = 20;

  beforeAll(() => {
    categories = [
      { id: 0, name: "CATEGORY_HAVANA_LANDMARKS", folder: "habana" },
      { id: 1, name: "CATEGORY_MONTREAL_LANDMARKS", folder: "montreal" },
      { id: 2, name: "CATEGORY_VANCOUVER_LANDMARKS", folder: "vancouver" },
      { id: 3, name: "CATEGORY_SPAIN_LANDMARKS", folder: "spain" },
      { id: 4, name: "CATEGORY_GERMANY_LANDMARKS", folder: "germany" },
      { id: 5, name: "CATEGORY_SOCCER_PLAYERS", folder: "soccer" },
      { id: 6, name: "CATEGORY_FRUITS_AND_VEGETABLES", folder: "fruits" },
      { id: 7, name: "CATEGORY_ANIMALS", folder: "animals" },
      { id: 8, name: "CATEGORY_PUPPIES", folder: "puppies" },
      { id: 9, name: "CATEGORY_SEINFELD", folder: "seinfeld" },
    ];

    newState = {
      category: {
        id: 0,
        folder: "habana",
        name: "CATEGORY_HAVANA_LANDMARKS",
      },
      userImage: 0,
      computerImage: 1,
      first: Player.Computer,
      level: PlayingLevel.Smart,
      disabled: true,
      over: true,
      result: GameResult.Won,
      winners: [1, 2, 3],
    };
  });

  const renderContextWithCategory = () => {
    const TestComponent = () => {
      const { game, dispatch } = useContext(GameContext);

      let randomCategoryId = Math.floor(Math.random() * categories.length);
      while (randomCategoryId === game.category.id) {
        randomCategoryId = Math.floor(Math.random() * categories.length);
      }

      newState.category = {
        ...categories[randomCategoryId],
      };

      return (
        <>
          <div>{game.category.name}</div>

          <button onClick={() => dispatch(changeCategory(newState.category))}>
            Change the category
          </button>
        </>
      );
    };

    return render(
      <GameContextProvider>
        <TestComponent />
      </GameContextProvider>
    );
  };

  const renderContextWithImages = () => {
    const TestComponent = () => {
      const { game, dispatch } = useContext(GameContext);

      let userImage = game.userImage;
      const computerImage = game.computerImage;

      while (userImage === computerImage) {
        userImage = Math.floor(
          Math.random() * IMAGES_PER_CATEGORY
        ) as ImageName;
      }

      let newUserImage = newState.userImage;
      let newComputerImage = newState.computerImage;

      while (newUserImage === userImage || newUserImage === computerImage) {
        newUserImage = Math.floor(
          Math.random() * IMAGES_PER_CATEGORY
        ) as ImageName;
      }

      while (
        newComputerImage === userImage ||
        newComputerImage === computerImage ||
        newComputerImage === newState.userImage
      ) {
        newComputerImage = Math.floor(
          Math.random() * IMAGES_PER_CATEGORY
        ) as ImageName;
      }

      newState.userImage = newUserImage;
      newState.computerImage = newComputerImage;

      return (
        <>
          <div>{userImage}</div>
          <div>{computerImage}</div>

          <button
            onClick={() => {
              dispatch(changeUserImage(newState.userImage));
              dispatch(changeComputerImage(newState.computerImage));
            }}
          >
            Change both the user and the computer images
          </button>
        </>
      );
    };

    return render(
      <GameContextProvider>
        <TestComponent />
      </GameContextProvider>
    );
  };

  const renderContextWithStartingPlayer = () => {
    const TestComponent = () => {
      const { game, dispatch } = useContext(GameContext);

      return (
        <>
          <div>{game.first}</div>

          <button onClick={() => dispatch(changeFirst(newState.first))}>
            Change the starting player
          </button>
        </>
      );
    };

    return render(
      <GameContextProvider>
        <TestComponent />
      </GameContextProvider>
    );
  };

  const renderContextWithLevel = () => {
    const TestComponent = () => {
      const { game, dispatch } = useContext(GameContext);

      return (
        <>
          <div>{game.level}</div>

          <button onClick={() => dispatch(changeLevel(newState.level))}>
            Change the computer playing level
          </button>
        </>
      );
    };

    return render(
      <GameContextProvider>
        <TestComponent />
      </GameContextProvider>
    );
  };

  const renderContextWithDisabledStatus = () => {
    const TestComponent = () => {
      const { game, dispatch } = useContext(GameContext);

      return (
        <>
          <div>{game.disabled + ""}</div>

          <button onClick={() => dispatch(changeDisabled(newState.disabled))}>
            Change the disabled status
          </button>
        </>
      );
    };

    return render(
      <GameContextProvider>
        <TestComponent />
      </GameContextProvider>
    );
  };

  const renderContextWithOverStatus = () => {
    const TestComponent = () => {
      const { game, dispatch } = useContext(GameContext);

      return (
        <>
          <div>{game.over + ""}</div>

          <button onClick={() => dispatch(changeOver(newState.over))}>
            Change the game over status
          </button>
        </>
      );
    };

    return render(
      <GameContextProvider>
        <TestComponent />
      </GameContextProvider>
    );
  };

  const renderContextWithResult = () => {
    const TestComponent = () => {
      const { game, dispatch } = useContext(GameContext);

      return (
        <>
          <div>{game.result + ""}</div>

          <button onClick={() => dispatch(changeResult(newState.result))}>
            Change the game result
          </button>
        </>
      );
    };

    return render(
      <GameContextProvider>
        <TestComponent />
      </GameContextProvider>
    );
  };

  const renderContextWithWinners = () => {
    const TestComponent = () => {
      const { game, dispatch } = useContext(GameContext);

      return (
        <>
          <div>{game.winners + ""}</div>

          <button
            id="btn"
            onClick={() => dispatch(changeWinners(newState.winners))}
          >
            Change the winning squares
          </button>
        </>
      );
    };

    return render(
      <GameContextProvider>
        <TestComponent />
      </GameContextProvider>
    );
  };

  let gameState: State;

  const renderContextStateUnchanged = () => {
    const TestComponent = () => {
      const { game, dispatch } = useContext(GameContext);
      gameState = game;

      return (
        <>
          <button id="btn" onClick={() => dispatch({ type: "UNKNOWN" })}>
            State do not change
          </button>
        </>
      );
    };

    return render(
      <GameContextProvider>
        <TestComponent />
      </GameContextProvider>
    );
  };

  it("should change the category", async () => {
    const user = userEvent.setup();
    renderContextWithCategory();
    const { name } = newState.category;

    expect(screen.queryByText(name)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(screen.getByText(name)).toBeInTheDocument();
  });

  it("should change the images", async () => {
    const user = userEvent.setup();
    renderContextWithImages();
    const userImage = newState.userImage;
    const computerImage = newState.computerImage;

    expect(screen.queryByText(userImage)).not.toBeInTheDocument();
    expect(screen.queryByText(computerImage)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(screen.getByText(userImage)).toBeInTheDocument();
    expect(screen.getByText(computerImage)).toBeInTheDocument();
  });

  it("should change the starting player", async () => {
    const user = userEvent.setup();
    renderContextWithStartingPlayer();
    const first = newState.first;

    expect(screen.queryByText(first)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(screen.getByText(first)).toBeInTheDocument();
  });

  it("should change the computer playing level", async () => {
    const user = userEvent.setup();
    renderContextWithLevel();
    const level = newState.level;

    expect(screen.queryByText(level)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(screen.getByText(level)).toBeInTheDocument();
  });

  it("should change the board disabled status", async () => {
    const user = userEvent.setup();
    renderContextWithDisabledStatus();
    const disabled = newState.disabled + "";

    expect(screen.queryByText(disabled)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(screen.getByText(disabled)).toBeInTheDocument();
  });

  it("should change the game over status", async () => {
    const user = userEvent.setup();
    renderContextWithOverStatus();
    const over = newState.over + "";

    expect(screen.queryByText(over)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(screen.getByText(over)).toBeInTheDocument();
  });

  it("should change the game result", async () => {
    const user = userEvent.setup();
    renderContextWithResult();
    const result = newState.result + "";

    expect(screen.queryByText(result)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(screen.getByText(result)).toBeInTheDocument();
  });

  it("should change the game winner squares", async () => {
    const user = userEvent.setup();
    renderContextWithWinners();
    const winners = newState.winners + "";

    expect(screen.queryByText(winners)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(screen.getByText(winners)).toBeInTheDocument();
  });

  it("should not change the game state", async () => {
    const user = userEvent.setup();
    renderContextStateUnchanged();
    const savedGameState = gameState;

    await user.click(screen.getByRole("button"));

    expect(savedGameState).toEqual(gameState);
  });
});
