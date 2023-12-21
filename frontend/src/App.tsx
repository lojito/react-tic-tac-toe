import React, { FC, useEffect } from "react";
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from "react-router-dom";
import About from "./components/About/About";
import AuthForm from "./components/Auth/AuthForm";
import Contact from "./components/Contact/Contact";
import Flags from "./components/Flag/Flag";
import Game from "./components/Game/Game";
import GameHistorical from "./components/Historical/GameHistorical";
import GamesHistorical from "./components/Historical/GamesHistorical";
import Navigation from "./components/Navigation/Navigation";
import Repository from "./components/Repository/Repository";
import DictionaryContextProvider from "./contexts/dictionary/DictionaryContextProvider";
import GameContextProvider from "./contexts/game/GameContextProvider";
import LanguageContextProvider from "./contexts/language/LanguageContextProvider";
import useAuth from "./hooks/auth/useAuth";

interface Props extends RouteComponentProps {}

const App: FC<Props> = ({ history }) => {
  const {
    isLoggedIn,
    isSignedUp,
    token,
    name,
    error,
    handleLogin,
    handleSignup,
    handleLogout,
  } = useAuth();

  useEffect(() => {
    if (isSignedUp) {
      history?.replace("/");
    }
  }, [isSignedUp, history]);

  let routes = (
    <Switch>
      <Route
        path="/"
        exact
        render={(props) => (
          <AuthForm
            {...props}
            onLogin={handleLogin}
            authType={"login"}
            error={error}
          />
        )}
      />

      <Route
        path="/signup"
        exact
        render={(props) => (
          <AuthForm
            {...props}
            onSignup={handleSignup}
            authType={"signup"}
            error={error}
          />
        )}
      />

      <Redirect to="/" />
    </Switch>
  );

  if (isLoggedIn) {
    routes = (
      <GameContextProvider>
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => <Game {...props} token={token} name={name} />}
          />
          <Route
            exact
            path="/historical"
            render={(props) => <GamesHistorical {...props} token={token} />}
          />
          <Route
            path="/historical/:id"
            render={(props) => <GameHistorical {...props} token={token} />}
          />
          <Route path="/repository" component={Repository} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Redirect to="/" />
        </Switch>
      </GameContextProvider>
    );
  }

  return (
    <LanguageContextProvider>
      <DictionaryContextProvider>
        <div className="header">
          <Flags />
          <Navigation isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        </div>
        {routes}
      </DictionaryContextProvider>
    </LanguageContextProvider>
  );
};

export default withRouter(App);
