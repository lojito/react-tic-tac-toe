import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import ImageHistorical from "../../../components/Image/Historical";
import {
  DictionaryContext,
  DictionaryEntry,
} from "../../../contexts/dictionary/DictionaryContext";
import { ImageFolder, ImageName } from "../../../types";

describe("ImageHistorical", () => {
  const LIONEL_MESSI = 13;
  const CRISTIANO_RONALDO = 15;

  interface Props {
    folder: ImageFolder;
    userImage: ImageName;
    computerImage: ImageName;
  }

  const renderImageHistorical = (
    {
      folder = "soccer",
      userImage = LIONEL_MESSI,
      computerImage = CRISTIANO_RONALDO,
    }: Props = {
      folder: "soccer",
      userImage: LIONEL_MESSI,
      computerImage: CRISTIANO_RONALDO,
    }
  ) => {
    const mockDictionary = {
      IMAGE_USER_LABEL: "You",
      IMAGE_COMPUTER_LABEL: "PC",
    } as DictionaryEntry;

    const utils = render(
      <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
        <ImageHistorical
          folder={folder}
          userImage={userImage}
          computerImage={computerImage}
        />
      </DictionaryContext.Provider>
    );

    const divWrapper = screen.getByTestId("images-historical");
    const userImage1 = screen.getByRole("img", { name: "user" });
    const computerImage1 = screen.getByRole("img", { name: "computer" });
    const labelUserImage = screen.getByText(
      mockDictionary.IMAGE_USER_LABEL + ":"
    );
    const labelComputerImage = screen.getByText(
      mockDictionary.IMAGE_COMPUTER_LABEL + ":"
    );

    return {
      ...utils,
      mockDictionary,
      divWrapper,
      userImage1,
      computerImage1,
      labelUserImage,
      labelComputerImage,
    };
  };

  it("should render correctly", () => {
    const { asFragment } = renderImageHistorical();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should apply the 'images' and 'historical' classes", () => {
    const { divWrapper } = renderImageHistorical();

    expect(divWrapper).toHaveClass("images");
    expect(divWrapper).toHaveClass("historical");
  });

  it("should find the text 'You:' in the document", () => {
    const { labelUserImage } = renderImageHistorical();

    expect(labelUserImage).toBeInTheDocument();
  });

  it("should find the text 'PC:' in the document", () => {
    const { labelComputerImage } = renderImageHistorical();

    expect(labelComputerImage).toBeInTheDocument();
  });

  it("should find the user image in the document", () => {
    const { userImage1 } = renderImageHistorical();

    expect(userImage1).toBeInTheDocument();
  });

  it("should find the computer image in the document", () => {
    const { computerImage1 } = renderImageHistorical();

    expect(computerImage1).toBeInTheDocument();
  });
});
