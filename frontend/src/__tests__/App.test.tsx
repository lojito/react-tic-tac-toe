import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import App from "../App";
import useAuth from "../hooks/auth/useAuth";

jest.mock("../components/Auth/AuthForm", () => () => (
  <>
    <div>Auth form component</div>
  </>
));

jest.mock("../components/Flag/Flag", () => () => (
  <>
    <div>Flag component</div>
  </>
));

jest.mock("../components/Navigation/Navigation", () => () => (
  <>
    <div>Navigation component</div>
  </>
));

jest.mock("../Pages/Game/Game", () => () => (
  <>
    <div>Game component</div>
  </>
));

jest.mock("../Pages/GamesHistorical/GamesHistorical", () => () => (
  <>
    <div>Games historical component</div>
  </>
));

jest.mock("../Pages/GameHistorical/GameHistorical", () => () => (
  <>
    <div>Game historical component</div>
  </>
));

jest.mock("../Pages/About/About", () => () => (
  <>
    <div>About component</div>
  </>
));

jest.mock("../Pages/Contact/Contact", () => () => (
  <>
    <div>Contact component</div>
  </>
));

jest.mock("../hooks/auth/useAuth");

describe("App", () => {
  interface Props {
    isLoggedIn?: boolean;
    isSignedUp?: boolean;
    token?: string;
    name?: string;
    pathname?: string;
  }

  const renderApp = ({
    isLoggedIn = false,
    isSignedUp = false,
    token = "",
    name = "",
    pathname = "/",
  }: Props = {}) => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoggedIn,
      isSignedUp,
      token,
      userId: "",
      name,
      error: "",
      handleLogin: jest.fn,
      handleSignup: jest.fn,
      handleLogout: jest.fn,
    });

    const history = createMemoryHistory();
    history.push = jest.fn();
    history.location.pathname = pathname;

    const utils = render(
      <Router history={history}>
        <App />
      </Router>
    );

    return {
      ...utils,
    };
  };

  it("should render correctly", () => {
    const { asFragment } = renderApp();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should display the Auth form component after signing up", () => {
    const isSignedUp = true;

    renderApp({ isSignedUp });

    expect(screen.getByText("Auth form component")).toBeInTheDocument();
  });

  it("should display the Auth form component onload", () => {
    renderApp();

    expect(screen.getByText("Auth form component")).toBeInTheDocument();
  });

  it("should display the Auth form component on clicking on the singup navigation option", () => {
    const pathname = "/signup";

    renderApp({ pathname });

    expect(screen.getByText("Auth form component")).toBeInTheDocument();
  });

  it("should display the Flag component", () => {
    renderApp();

    expect(screen.getByText("Flag component")).toBeInTheDocument();
  });

  it("should display the Navigation component", () => {
    renderApp();

    expect(screen.getByText("Navigation component")).toBeInTheDocument();
  });

  it("should display the Game component", () => {
    const isLoggedIn = true;
    const token = "token";
    const name = "Livan";

    renderApp({ isLoggedIn, token, name });

    expect(screen.getByText("Game component")).toBeInTheDocument();
  });

  it("should display the Games historical component", () => {
    const isLoggedIn = true;
    const token = "token";
    const pathname = "/historical";

    renderApp({
      isLoggedIn,
      token,
      pathname,
    });

    expect(screen.getByText("Games historical component")).toBeInTheDocument();
  });

  it("should display the Game historical component", () => {
    const isLoggedIn = true;
    const token = "token";
    const pathname = "/historical/6380718fb9818b4a4d189a50";

    renderApp({ isLoggedIn, token, pathname });

    expect(screen.getByText("Game historical component")).toBeInTheDocument();
  });

  it("should display the About component", () => {
    const isLoggedIn = true;
    const token = "token";
    const pathname = "/about";

    renderApp({
      isLoggedIn,
      token,
      pathname,
    });

    expect(screen.getByText("About component")).toBeInTheDocument();
  });

  it("should display the Contact component", () => {
    const isLoggedIn = true;
    const token = "token";
    const pathname = "/contact";

    renderApp({
      isLoggedIn,
      token,
      pathname,
    });

    expect(screen.getByText("Contact component")).toBeInTheDocument();
  });
});
