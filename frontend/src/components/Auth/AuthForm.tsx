import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import "./Auth.scss";

export type Account = {
  email: string;
  name?: string;
  password: string;
};

interface Props {
  onSignup?: (account: Account) => void;
  onLogin?: (account: Account) => void;
  authType: string;
  error: string;
}

const AuthForm: FC<Props> = ({ onSignup, onLogin, authType, error }) => {
  const {
    dictionary: {
      BUTTON_SIGNUP,
      BUTTON_SIGNIN,
      AUTH_FORM_EMAIL_LABEL,
      AUTH_FORM_EMAIL_PLACEHOLDER,
      AUTH_FORM_NAME_LABEL,
      AUTH_FORM_NAME_PLACEHOLDER,
      AUTH_FORM_PASSWORD_PLACEHOLDER,
      AUTH_FORM_PASSWORD_LABEL,
    },
  } = useContext(DictionaryContext);

  const [account, setAccount] = useState<Account>({
    email: "",
    name: "",
    password: "",
  });

  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef!.current!.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (authType === "signup") {
      onSignup!(account);
    } else {
      onLogin!(account);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccount({
      ...account,
      [e.target.id]: e.target.value,
    });
  };

  const btnName = authType === "signup" ? BUTTON_SIGNUP : BUTTON_SIGNIN;

  return (
    <section className="authSection">
      <form onSubmit={handleSubmit}>
        <div className="input">
          <label htmlFor="email">{AUTH_FORM_EMAIL_LABEL}</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={account.email}
            placeholder={AUTH_FORM_EMAIL_PLACEHOLDER}
            onChange={handleChange}
            ref={emailRef}
          />
        </div>

        {authType === "signup" && (
          <div className="input">
            <label htmlFor="name">{AUTH_FORM_NAME_LABEL}</label>
            <input
              id="name"
              type="text"
              required
              value={account.name}
              placeholder={AUTH_FORM_NAME_PLACEHOLDER}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="input">
          <label htmlFor="password">{AUTH_FORM_PASSWORD_LABEL}</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={account.password}
            placeholder={AUTH_FORM_PASSWORD_PLACEHOLDER}
            onChange={handleChange}
          />
        </div>

        <div className="button">
          <button type="submit" name={btnName}>
            {btnName}
          </button>
        </div>

        {error && (
          <div className="info" data-testid="error">
            {error}
          </div>
        )}
      </form>
    </section>
  );
};

export default AuthForm;
