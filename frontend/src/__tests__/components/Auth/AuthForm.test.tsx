import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import AuthForm from "../../../components/Auth/AuthForm";
import {
  DictionaryContext,
  DictionaryEntry,
} from "../../../contexts/dictionary/DictionaryContext";

jest.mock("../../../hooks/auth/useAuth");

const mockDictionary = {
  AUTH_FORM_EMAIL_LABEL: "E-mail",
  AUTH_FORM_NAME_LABEL: "Name",
  AUTH_FORM_PASSWORD_LABEL: "Password",
  BUTTON_SIGNUP: "Sign up",
  BUTTON_SIGNIN: "Log in",
} as DictionaryEntry;

const handleSignup = jest.fn();
const handleLogin = jest.fn();

const history = createMemoryHistory();
history.push = jest.fn();

describe("AuthForm", () => {
  interface Props {
    authType: string;
    error?: string;
  }

  const TestComponent = ({ authType, error = "" }: Props) => {
    return (
      <DictionaryContext.Provider value={{ dictionary: mockDictionary }}>
        <Router history={history}>
          <AuthForm
            onSignup={handleSignup}
            onLogin={handleLogin}
            authType={authType}
            error={error}
          />
        </Router>
      </DictionaryContext.Provider>
    );
  };

  const renderAuthForm = (
    { authType = "signup", error = "" }: Props = {
      authType: "signup",
      error: "",
    }
  ) => {
    const utils = render(<TestComponent authType={authType} error={error} />);

    const emailLabel = screen.getByLabelText(
      mockDictionary.AUTH_FORM_EMAIL_LABEL
    );
    const email = screen.getByRole("textbox", {
      name: mockDictionary.AUTH_FORM_EMAIL_LABEL,
    });

    const nameLabel = screen.queryByLabelText(
      mockDictionary.AUTH_FORM_NAME_LABEL
    );
    const name = screen.queryByRole("textbox", {
      name: mockDictionary.AUTH_FORM_NAME_LABEL,
    });

    const passwordLabel = screen.getByLabelText(
      mockDictionary.AUTH_FORM_PASSWORD_LABEL
    );

    const signUpButton = screen.queryByRole("button", {
      name: mockDictionary.BUTTON_SIGNUP,
    });
    const signInButton = screen.queryByRole("button", {
      name: mockDictionary.BUTTON_SIGNIN,
    });

    return {
      ...utils,
      mockDictionary,
      handleSignup,
      handleLogin,
      emailLabel,
      email,
      nameLabel,
      name,
      passwordLabel,
      signUpButton,
      signInButton,
    };
  };

  it("should render correctly", () => {
    const { asFragment } = renderAuthForm();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should render the signup form", () => {
    const {
      emailLabel,
      email,
      nameLabel,
      name,
      passwordLabel,
      signUpButton,
      signInButton,
    } = renderAuthForm();

    expect(emailLabel).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(nameLabel).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
    expect(signInButton).not.toBeInTheDocument();
  });

  it("should render the login form", () => {
    const {
      emailLabel,
      email,
      nameLabel,
      name,
      passwordLabel,
      signUpButton,
      signInButton,
    } = renderAuthForm({ authType: "login" });

    expect(emailLabel).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(nameLabel).not.toBeInTheDocument();
    expect(name).not.toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
    expect(signUpButton).not.toBeInTheDocument();
    expect(signInButton).toBeInTheDocument();
  });

  it("should call the auth handler when signign up the user", () => {
    const { signUpButton, handleSignup } = renderAuthForm();

    userEvent.click(signUpButton!);

    expect(handleSignup).toHaveBeenCalled();
  });

  it("should call the auth handler when loging in the user", () => {
    const { signInButton, handleLogin } = renderAuthForm({ authType: "login" });

    userEvent.click(signInButton!);

    expect(handleLogin).toHaveBeenCalled();
  });

  it("should error when signing up the user", () => {
    const { signUpButton, rerender } = renderAuthForm();

    userEvent.click(signUpButton!);

    rerender(
      <TestComponent
        authType={"singup"}
        error={"There was an error while trying to sign up the user"}
      />
    );

    const errorDiv = screen.queryByTestId("error");

    expect(errorDiv).toBeInTheDocument();
  });

  it("should error when loging in the user", () => {
    const { signInButton, rerender } = renderAuthForm({ authType: "login" });

    userEvent.click(signInButton!);

    rerender(
      <TestComponent
        authType={"login"}
        error={"There was an error while trying to log in the user"}
      />
    );

    const errorDiv = screen.queryByTestId("error");

    expect(errorDiv).toBeInTheDocument();
  });

  it("should not error when loging in the user", () => {
    const { signInButton, rerender } = renderAuthForm({ authType: "login" });

    userEvent.click(signInButton!);

    rerender(<TestComponent authType={"login"} error={""} />);

    const errorDiv = screen.queryByTestId("error");

    expect(errorDiv).not.toBeInTheDocument();
  });

  it("should allow to enter the email", async () => {
    const userEmail = "livanojito@gmail.com";
    const { email } = renderAuthForm({ authType: "login" });

    userEvent.type(email, userEmail);

    await waitFor(() => {
      expect(email).toHaveValue(userEmail);
    });
  });

  it("should allow to enter the name", async () => {
    const userName = "livan";
    const { name } = renderAuthForm();

    userEvent.type(name!, userName);

    await waitFor(() => {
      expect(name).toHaveValue(userName);
    });
  });

  it("should allow to enter the password", async () => {
    const userPassword = "password";
    const { passwordLabel } = renderAuthForm();

    userEvent.type(passwordLabel!, userPassword);

    await waitFor(() => {
      expect(passwordLabel).toHaveValue(userPassword);
    });
  });
});
