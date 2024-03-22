import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Flags from "../../../components/Flag/Flag";
import {
  DictionaryContext,
  DictionaryEntry,
} from "../../../contexts/dictionary/DictionaryContext";
import {
  Language,
  LanguageContext,
} from "../../../contexts/language/LanguageContext";

describe("Flags", () => {
  const renderFlags = (language: Language = Language.English) => {
    const mockDictionary = {
      FLAG_ENGLISH_HINT: "English",
      FLAG_FRENCH_HINT: "French",
      FLAG_SPANISH_HINT: "Spanish",
    } as DictionaryEntry;

    const handleChangeLanguage = jest.fn();

    const utils = render(
      <LanguageContext.Provider value={{ language, handleChangeLanguage }}>
        <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
          <Flags />
        </DictionaryContext.Provider>
      </LanguageContext.Provider>
    );

    const divWrapper = screen.getByTestId("flags");
    const imgEnglish = screen.getByRole("img", {
      name: mockDictionary.FLAG_ENGLISH_HINT,
    });
    const imgFrench = screen.getByRole("img", {
      name: mockDictionary.FLAG_FRENCH_HINT,
    });
    const imgSpanish = screen.getByRole("img", {
      name: mockDictionary.FLAG_SPANISH_HINT,
    });

    return {
      ...utils,
      mockDictionary,
      divWrapper,
      imgEnglish,
      imgFrench,
      imgSpanish,
      handleChangeLanguage,
    };
  };

  it("renders the component correctly", () => {
    const { asFragment } = renderFlags();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should apply the 'flags' class", () => {
    const { divWrapper } = renderFlags();

    expect(divWrapper).toHaveClass("flags");
  });

  it("should display the image flags", () => {
    const { imgEnglish, imgFrench, imgSpanish } = renderFlags();

    expect(imgEnglish).toBeInTheDocument();
    expect(imgFrench).toBeInTheDocument();
    expect(imgSpanish).toBeInTheDocument();
  });

  it("should apply english image element title attribute and value", () => {
    const { mockDictionary, imgEnglish } = renderFlags();

    expect(imgEnglish).toHaveAttribute(
      "title",
      mockDictionary.FLAG_ENGLISH_HINT
    );
  });

  it("should apply french image element title attribute and value", () => {
    const { mockDictionary, imgFrench } = renderFlags();

    expect(imgFrench).toHaveAttribute("title", mockDictionary.FLAG_FRENCH_HINT);
  });

  it("should apply spanish image element title attribute and value", () => {
    const { mockDictionary, imgSpanish } = renderFlags();

    expect(imgSpanish).toHaveAttribute(
      "title",
      mockDictionary.FLAG_SPANISH_HINT
    );
  });

  it("should call the handleChangeLanguage when clicking on the english flag", async () => {
    const user = userEvent.setup();
    const { imgEnglish, handleChangeLanguage } = renderFlags();

    await user.click(imgEnglish);

    expect(handleChangeLanguage).toHaveBeenCalledTimes(1);
    expect(handleChangeLanguage).toHaveBeenCalledWith(Language.English);
  });

  it("should call the handleChangeLanguage when clicking on the french flag", async () => {
    const user = userEvent.setup();
    const { imgFrench, handleChangeLanguage } = renderFlags();

    await user.click(imgFrench);

    expect(handleChangeLanguage).toHaveBeenCalledTimes(1);
    expect(handleChangeLanguage).toHaveBeenCalledWith(Language.French);
  });

  it("should call the handleChangeLanguage when clicking on the spanish flag", async () => {
    const user = userEvent.setup();
    const { imgSpanish, handleChangeLanguage } = renderFlags();

    await user.click(imgSpanish);

    expect(handleChangeLanguage).toHaveBeenCalledTimes(1);
    expect(handleChangeLanguage).toHaveBeenCalledWith(Language.Spanish);
  });

  it("should select the english flag", () => {
    const { imgEnglish } = renderFlags();

    expect(imgEnglish).toHaveStyle("opacity: 0.5");
  });

  it("should select the french flag", () => {
    const { imgFrench } = renderFlags(Language.French);

    expect(imgFrench).toHaveStyle("opacity: 0.5");
  });

  it("should select the spanish flag", () => {
    const { imgSpanish } = renderFlags(Language.Spanish);

    expect(imgSpanish).toHaveStyle("opacity: 0.5");
  });
});
