import React, { FC, useContext, useRef } from "react";
import { NavLink } from "react-router-dom";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import "./Navigation.scss";

type Props = {
  isLoggedIn: boolean;
  onLogout: () => void;
};

const Navigation: FC<Props> = ({ isLoggedIn, onLogout }) => {
  const {
    dictionary: {
      GAME,
      HISTORICAL,
      REPOSITORY,
      ABOUT,
      CONTACT,
      BUTTON_LOGOUT,
      LOGIN,
      SIGNUP,
    },
  } = useContext(DictionaryContext);
  const inputRef = useRef<HTMLInputElement>(null);

  function collapseMobileMenu() {
    inputRef.current!.checked = false;
  }

  return (
    <nav>
      <input
        data-testid="mobile-menu-chk"
        type="checkbox"
        id="menu"
        ref={inputRef}
      />
      <label className="mylabel" htmlFor="menu">
        <div id="burger-container">
          <div id="burger">
            <span>&nbsp;</span>
            <span>&nbsp;</span>
            <span>&nbsp;</span>
          </div>
        </div>
      </label>
      <ul data-testid="nav" className="nav" onClick={collapseMobileMenu}>
        {isLoggedIn ? (
          <>
            <li key="game">
              <NavLink exact to="/">
                {GAME}
              </NavLink>
            </li>
            <li key="historical">
              <NavLink to="/historical">{HISTORICAL}</NavLink>
            </li>
            <li key="repository">
              <NavLink to="/repository">{REPOSITORY}</NavLink>
            </li>
            <li key="about">
              <NavLink to="/about">{ABOUT}</NavLink>
            </li>
            <li key="contact">
              <NavLink to="/contact">{CONTACT}</NavLink>
            </li>
            <li key="logout">
              <button onClick={onLogout}>{BUTTON_LOGOUT}</button>
            </li>
          </>
        ) : (
          <>
            <li key="login">
              <NavLink exact to="/">
                {LOGIN}
              </NavLink>
            </li>
            <li key="signup">
              <NavLink to="/signup">{SIGNUP}</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
