import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { DictionaryContext } from "../../../contexts/dictionary/DictionaryContext";
import About from "../../../pages/About/About";

describe("About", () => {
  const mockDictionary = {
    ABOUT_GAME_DEVELOPED_WITH: "This game has been developed with:",
    ABOUT_SOURCE_CODE: "Source Code:",
    ABOUT_OTHER_HOME_PROJECTS: "Other projects:",
  };

  const renderAbout = () => {
    const utils = render(
      <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
        <About />
      </DictionaryContext.Provider>
    );
    const aboutWrapper = screen.getByTestId("about");
    const gameDevelopedWith = screen.getByText(
      mockDictionary.ABOUT_GAME_DEVELOPED_WITH
    );
    const sourceCode = screen.getByText(mockDictionary.ABOUT_SOURCE_CODE);
    const otherHomeProjects = screen.getByText(
      mockDictionary.ABOUT_OTHER_HOME_PROJECTS
    );

    return {
      ...utils,
      aboutWrapper,
      gameDevelopedWith,
      sourceCode,
      otherHomeProjects,
    };
  };

  it("should render correctly", () => {
    const { asFragment } = renderAbout();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should display the About info and apply the 'about' class", () => {
    const { aboutWrapper } = renderAbout();

    expect(aboutWrapper).toBeInTheDocument();
    expect(aboutWrapper).toHaveClass("about");
  });

  it("should display the texts 'Game developed with', 'Source Code', 'Other projects'", () => {
    const { gameDevelopedWith, sourceCode, otherHomeProjects } = renderAbout();

    expect(gameDevelopedWith).toBeInTheDocument();
    expect(sourceCode).toBeInTheDocument();
    expect(otherHomeProjects).toBeInTheDocument();
  });

  it("should display the teck stack list", () => {
    const techStack = [
      "Node.js",
      "Express",
      "Mongoose",
      "MongoDB",
      "Typescript",
      "React.js",
      "React Hooks",
      "Context API",
      "React Testing Library",
      "Jest",
      "HTML5",
      "CSS3",
      "SASS",
    ];

    renderAbout();

    for (const tech of techStack) {
      expect(screen.getByRole("link", { name: tech })).toBeInTheDocument();
    }
  });

  it("should display the 'Source code' info", () => {
    renderAbout();

    expect(
      screen.getByRole("link", { name: /tic-tac-toe/ })
    ).toBeInTheDocument();
  });

  it("should display the projects list", () => {
    const otherProjects = [
      "Puzzle (Angular)",
      "Matching pairs (Vue.js)",
      "Tic-tac-toe 4x4 (Django)",
      "Tic-tac-toe (Python)",
      "Base converter (Rust)",
      "In-memory database engine (C)",
      "Bubble sort sorting algorithm (Assembly)",
    ];

    renderAbout();

    for (const project of otherProjects) {
      expect(screen.getByRole("link", { name: project })).toBeInTheDocument();
    }
  });
});
