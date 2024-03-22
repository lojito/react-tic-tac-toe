import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import Navigation from "../../../components/Navigation/Navigation";
import { DictionaryContext } from "../../../contexts/dictionary/DictionaryContext";

describe("Navigation", () => {
  const mockDictionary = {
    GAME: "Game",
    HISTORICAL: "Historical",
    REPOSITORY: "Repository",
    ABOUT: "About",
    CONTACT: "Contact",
    LOGIN: "SignIn",
    SIGNUP: "SignUp",
  };

  const renderNavigation = (isLoggedIn: boolean = true) => {
    const onLogout = jest.fn;

    const history = createMemoryHistory();
    history.push = jest.fn();

    const utils = render(
      <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
        <Router history={history}>
          <Navigation isLoggedIn={isLoggedIn} onLogout={onLogout} />
        </Router>
      </DictionaryContext.Provider>
    );

    const game = screen.queryByRole("link", {
      name: mockDictionary.GAME,
    });

    const historyNav = screen.queryByRole("link", {
      name: mockDictionary.HISTORICAL,
    });

    const repository = screen.queryByRole("link", {
      name: mockDictionary.REPOSITORY,
    });

    const about = screen.queryByRole("link", {
      name: mockDictionary.ABOUT,
    });

    const contact = screen.queryByRole("link", {
      name: mockDictionary.CONTACT,
    });

    const login = screen.queryByRole("link", {
      name: mockDictionary.LOGIN,
    });

    const signup = screen.queryByRole("link", {
      name: mockDictionary.SIGNUP,
    });

    return {
      ...utils,
      game,
      historyNav,
      repository,
      about,
      contact,
      login,
      signup,
      history,
    };
  };

  it("renders the Navigation component correctly", () => {
    const { asFragment } = renderNavigation();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should display the navigation bar", () => {
    renderNavigation();

    expect(screen.getByTestId("nav")).toHaveClass("nav");
  });

  it("should display the navigation menu items but Singin and Singup", () => {
    const { game, historyNav, repository, about, contact, login, signup } =
      renderNavigation();

    expect(game).toBeInTheDocument();
    expect(historyNav).toBeInTheDocument();
    expect(repository).toBeInTheDocument();
    expect(about).toBeInTheDocument();
    expect(contact).toBeInTheDocument();
    expect(login).not.toBeInTheDocument();
    expect(signup).not.toBeInTheDocument();
  });

  it("should display the Signin and Singup navigation menu items only", () => {
    const isLoggedIn = false;

    const { game, historyNav, repository, about, contact, login, signup } =
      renderNavigation(isLoggedIn);

    expect(game).not.toBeInTheDocument();
    expect(historyNav).not.toBeInTheDocument();
    expect(repository).not.toBeInTheDocument();
    expect(about).not.toBeInTheDocument();
    expect(contact).not.toBeInTheDocument();
    expect(login).toBeInTheDocument();
    expect(signup).toBeInTheDocument();
  });

  it("should route to the Game component", async () => {
    const user = userEvent.setup();
    const { game, history } = renderNavigation();

    await user.click(game!);

    expect(history.push).not.toHaveBeenCalled();
  });

  it("should set the href attribute of the 'Game' menu item", () => {
    const { game } = renderNavigation();

    expect(game).toHaveAttribute("href", "/");
  });

  it("should route to the Historical component", async () => {
    const user = userEvent.setup();
    const { historyNav, history } = renderNavigation();

    await user.click(historyNav!);

    expect(history.push).toHaveBeenCalledWith({
      hash: "",
      pathname: "/historical",
      search: "",
      state: null,
    });
  });

  it("should set the href attribute of the 'Historical' menu item", () => {
    const { historyNav } = renderNavigation();

    expect(historyNav).toHaveAttribute("href", "/historical");
  });

  it("should route to the Repository component", async () => {
    const user = userEvent.setup();
    const { repository, history } = renderNavigation();

    await user.click(repository!);

    expect(history.push).toHaveBeenCalledWith({
      hash: "",
      pathname: "/repository",
      search: "",
      state: null,
    });
  });

  it("should set the href attribute of the 'Repository' menu item", () => {
    const { repository } = renderNavigation();

    expect(repository).toHaveAttribute("href", "/repository");
  });

  it("should route to the About component", async () => {
    const user = userEvent.setup();
    const { about, history } = renderNavigation();

    await user.click(about!);

    expect(history.push).toHaveBeenCalledWith({
      hash: "",
      pathname: "/about",
      search: "",
      state: null,
    });
  });

  it("should set the href attribute of the 'About' menu item", () => {
    const { about } = renderNavigation();

    expect(about).toHaveAttribute("href", "/about");
  });

  it("should route to the Contact component", async () => {
    const user = userEvent.setup();
    const { contact, history } = renderNavigation();

    await user.click(contact!);

    expect(history.push).toHaveBeenCalledWith({
      hash: "",
      pathname: "/contact",
      search: "",
      state: null,
    });
  });

  it("should set the href attribute of the 'Contact' menu item", () => {
    const { contact } = renderNavigation();

    expect(contact).toHaveAttribute("href", "/contact");
  });
});
