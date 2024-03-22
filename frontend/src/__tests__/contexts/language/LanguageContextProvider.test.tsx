import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useContext } from "react";
import {
  Language,
  LanguageContext,
} from "../../../contexts/language/LanguageContext";
import LanguageContextProvider from "../../../contexts/language/LanguageContextProvider";

const mockChangeLanguageHandler = jest.fn();

jest.mock("../../../hooks/useLanguage", () => ({
  __esModule: true,
  default: (language: Language) => ({
    language,
    handleChangeLanguage: mockChangeLanguageHandler,
  }),
}));

describe("LanguageContextProvider", () => {
  const renderTestComponent = () => {
    const TestComponent = () => {
      const { language, handleChangeLanguage } = useContext(LanguageContext);

      return (
        <>
          <div>{language}</div>
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

    return render(
      <LanguageContextProvider>
        <TestComponent />
      </LanguageContextProvider>
    );
  };

  it("should provide the dictionary", () => {
    renderTestComponent();

    expect(screen.getByText(Language.English)).toBeInTheDocument();
  });

  it("should call the change language handler", async () => {
    const user = userEvent.setup();
    renderTestComponent();

    await user.click(screen.getByText("Change language"));

    expect(mockChangeLanguageHandler).toHaveBeenCalled();
  });
});
