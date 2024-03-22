import React, { useContext } from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DictionaryContext } from "../../../contexts/dictionary/DictionaryContext";
import DictionaryContextProvider from "../../../contexts/dictionary/DictionaryContextProvider";
import {
  Language,
  LanguageContext,
} from "../../../contexts/language/LanguageContext";
import LanguageContextProvider from "../../../contexts/language/LanguageContextProvider";

describe("DictionaryContextProvider", () => {
  const mockDictionary = {
    data: [
      { CATEGORY_VANCOUVER_LANDMARKS: "Vancouver landmarks" },
      { CATEGORY_VANCOUVER_LANDMARKS: "Monumentos de Vancouver" },
      { CATEGORY_VANCOUVER_LANDMARKS: "Monuments de Vancouver" },
    ],
  };

  const renderTestComponent = () => {
    const TestComponent = () => {
      const { handleChangeLanguage } = useContext(LanguageContext);
      const { dictionary } = useContext(DictionaryContext);

      return (
        <>
          <div>{dictionary.CATEGORY_VANCOUVER_LANDMARKS}</div>
          <button
            onClick={() => {
              handleChangeLanguage!(Language.French);
            }}
          >
            Change language
          </button>
        </>
      );
    };

    const utils = render(
      <LanguageContextProvider>
        <DictionaryContextProvider>
          <TestComponent />
        </DictionaryContextProvider>
      </LanguageContextProvider>
    );

    return { ...utils, mockDictionary };
  };

  it("should change language", async () => {
    const user = userEvent.setup();
    const { mockDictionary } = renderTestComponent();

    expect(
      screen.getByText(
        mockDictionary.data[Language.English].CATEGORY_VANCOUVER_LANDMARKS
      )
    ).toBeInTheDocument();

    await user.click(screen.getByText("Change language"));

    expect(
      screen.getByText(
        mockDictionary.data[Language.French].CATEGORY_VANCOUVER_LANDMARKS
      )
    ).toBeInTheDocument();
  });
});
