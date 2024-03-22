import React, { useContext } from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { DictionaryContext } from "../../../contexts/dictionary/DictionaryContext";
import DictionaryContextProvider from "../../../contexts/dictionary/DictionaryContextProvider";
import { Language } from "../../../contexts/language/LanguageContext";

describe("DictionaryContextProvider", () => {
  const mockDictionary = {
    data: [
      { CATEGORY_VANCOUVER_LANDMARKS: "Vancouver landmarks" },
      { CATEGORY_VANCOUVER_LANDMARKS: "Monuments de Vancouver" },
      { CATEGORY_VANCOUVER_LANDMARKS: "Monumentos de Vancouver" },
    ],
  };

  const renderTestComponent = () => {
    const TestComponent = () => {
      const { dictionary } = useContext(DictionaryContext);

      return <>{dictionary.CATEGORY_VANCOUVER_LANDMARKS}</>;
    };

    const utils = render(
      <DictionaryContextProvider>
        <TestComponent />
      </DictionaryContextProvider>
    );

    return { ...utils, mockDictionary };
  };

  it("should provide the dictionary", () => {
    const { mockDictionary } = renderTestComponent();

    expect(
      screen.getByText(
        mockDictionary.data[Language.English].CATEGORY_VANCOUVER_LANDMARKS
      )
    ).toBeInTheDocument();
  });
});
