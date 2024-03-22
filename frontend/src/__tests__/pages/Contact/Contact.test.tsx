import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { DictionaryContext } from "../../../contexts/dictionary/DictionaryContext";
import Contact from "../../../pages/Contact/Contact";

describe("Contact", () => {
  const renderContact = () => {
    const mockDictionary = {
      CONTACT_AUTHOR: "Author:",
      CONTACT_EMAIL: "E-mail:",
      CONTACT_GITHUB: "Github:",
      CONTACT_LINKEDIN: "LinkedIn:",
    };

    const utils = render(
      <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
        <Contact />
      </DictionaryContext.Provider>
    );

    const contactWrapper = screen.getByTestId("contact");
    const author = screen.getByText(mockDictionary.CONTACT_AUTHOR);
    const email = screen.getByText(mockDictionary.CONTACT_EMAIL);
    const github = screen.getByText(mockDictionary.CONTACT_GITHUB);
    const linkedIn = screen.getByText(mockDictionary.CONTACT_LINKEDIN);

    return { ...utils, contactWrapper, author, email, github, linkedIn };
  };

  it("should render the component correctly", () => {
    const { asFragment } = renderContact();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should display the contact info and apply the 'contact' class", () => {
    const { contactWrapper } = renderContact();

    expect(contactWrapper).toBeInTheDocument();
    expect(contactWrapper).toHaveClass("contact");
  });

  it("should display the contact labels", () => {
    const { author, email, github, linkedIn } = renderContact();

    expect(author).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(github).toBeInTheDocument();
    expect(linkedIn).toBeInTheDocument();
  });

  it("should display the contact info", () => {
    renderContact();

    expect(screen.getByText("Livan Ojito Villanueva")).toBeInTheDocument();
    expect(screen.getByText("livanojito@gmail.com")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /github/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /linkedin/ })).toBeInTheDocument();
  });
});
