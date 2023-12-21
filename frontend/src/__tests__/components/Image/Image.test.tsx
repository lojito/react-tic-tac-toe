import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Image from "../../../components/Image/Image";
import {
  DictionaryContext,
  DictionaryEntry,
} from "../../../contexts/dictionary/DictionaryContext";
import { GameContext, State } from "../../../contexts/game/GameContext";
import * as hooks from "../../../hooks/useImages";
import { ImageName } from "../../../types";

const mockHandleRefreshImage = jest.fn();

jest.mock("../../../hooks/useImages", () => ({
  __esModule: true,
  default: (user = 0, computer = 1) => ({
    images: { user, computer },
    handleRefreshImage: mockHandleRefreshImage,
  }),
}));

jest.mock("../../../actions/game", () => {
  return {
    changeUserImage: (image: ImageName) => {
      return {
        type: "CHANGE_USER_IMAGE",
        image,
      };
    },
    changeComputerImage: (image: ImageName) => {
      return {
        type: "CHANGE_COMPUTER_IMAGE",
        image,
      };
    },
  };
});

describe("Image", () => {
  const game = {
    category: {
      id: 0,
      folder: "habana",
      name: "CATEGORY_HAVANA_LANDMARKS",
    },
    userImage: 0,
    computerImage: 1,
    disabled: false,
  } as State;

  const dispatch = jest.fn();

  const TestComponent = ({ disabled }: { disabled: boolean }) => {
    game.disabled = disabled;

    const mockDictionary = {
      IMAGE_USER_LABEL: "You",
      IMAGE_USER_TOOLTIP: "You will play with this image.",
      IMAGE_REFRESH_TOOLTIP: "Click to play with a different image.",
      IMAGE_COMPUTER_LABEL: "PC",
      IMAGE_COMPUTER_TOOLTIP: "The computer will play with this image.",
    } as DictionaryEntry;

    return (
      <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
        <GameContext.Provider value={{ game, dispatch }}>
          <Image />
        </GameContext.Provider>
      </DictionaryContext.Provider>
    );
  };

  interface Props {
    disabled: boolean;
  }

  const renderImages = ({ disabled = false }: Props = { disabled: false }) => {
    const utils = render(<TestComponent disabled={disabled} />);

    const divImages = screen.getByTestId("images");
    const userImage = screen.getByRole("img", { name: "refresh-user-img" });
    const computerImage = screen.getByRole("img", {
      name: "refresh-computer-img",
    });

    return { ...utils, divImages, userImage, computerImage, game };
  };

  it("renders the Image component correctly", () => {
    const { asFragment } = renderImages();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should display the images when disabled is true", () => {
    const { divImages } = renderImages();

    expect(divImages).toBeInTheDocument();
  });

  it("should display the images when disabled is false", () => {
    const { divImages } = renderImages();

    expect(divImages).toBeInTheDocument();
  });

  it("should call the refresh image handler when clicking on the user image", () => {
    const { userImage } = renderImages();

    userEvent.click(userImage);

    expect(mockHandleRefreshImage).toHaveBeenCalled();
  });

  it("should call the refresh image handler when clicking on the computer image", () => {
    const { computerImage } = renderImages();

    userEvent.click(computerImage);

    expect(mockHandleRefreshImage).toHaveBeenCalled();
  });

  it("should call the dispatch function when clicking on the user image", () => {
    const { userImage, rerender } = renderImages();

    userEvent.click(userImage);

    jest.spyOn(hooks, "default").mockImplementationOnce(() => ({
      images: { user: 2, computer: 1 },
      handleRefreshImage: mockHandleRefreshImage,
    }));

    rerender(<TestComponent disabled={false} />);

    expect(dispatch).toHaveBeenCalled();
  });

  it("should call the dispatch function when clicking on the computer image", () => {
    const { computerImage, rerender } = renderImages();

    userEvent.click(computerImage);

    jest.spyOn(hooks, "default").mockImplementationOnce(() => ({
      images: { user: 0, computer: 2 },
      handleRefreshImage: mockHandleRefreshImage,
    }));

    rerender(<TestComponent disabled={false} />);

    expect(dispatch).toHaveBeenCalled();
  });

  it("should not call the refresh image handler when clicking on the user image and the game is disabled", () => {
    const disabled = true;
    const { userImage } = renderImages({ disabled });

    const fnClick = () => userEvent.click(userImage);

    expect(fnClick).toThrow(/unable to click element/);
  });

  it("should not call the refresh image handler when clicking on the computer image and the game is disabled", () => {
    const disabled = true;
    const { computerImage } = renderImages({ disabled });

    const fnClick = () => userEvent.click(computerImage);

    expect(fnClick).toThrow(/unable to click element/);
  });
});
