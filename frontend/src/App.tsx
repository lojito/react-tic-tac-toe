import React, { FC, useEffect } from "react";
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from "react-router-dom";
import About from "./pages/About/About";
import AuthForm from "./components/Auth/AuthForm";
import Contact from "./pages/Contact/Contact";
import Flags from "./components/Flag/Flag";
import Game from "./pages/Game/Game";
import GameHistorical from "./pages/GameHistorical/GameHistorical";
import GamesHistorical from "./pages/GamesHistorical/GamesHistorical";
import Navigation from "./components/Navigation/Navigation";
import Repository from "./pages/Repository/Repository";
import GameContextProvider from "./contexts/game/GameContextProvider";
import useAuth from "./hooks/auth/useAuth";

interface Props extends RouteComponentProps {}

const App: FC<Props> = ({ history }) => {
  const {
    token,
    name,
    error,
    isLoggedIn,
    isSignedUp,
    handleLogin,
    handleSignup,
    handleLogout,
  } = useAuth();

  useEffect(() => {
    if (isSignedUp) {
      history?.replace("/");
    }
  }, [isSignedUp, history]);

  let routes;

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
  } else {
    routes = (
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => (
            <AuthForm
              {...props}
              onLogin={handleLogin}
              authType="login"
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
              authType="signup"
              error={error}
            />
          )}
        />
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <div>
      <div className="header">
        <Flags />
        <Navigation isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      </div>
      {routes}
    </div>
  );
};

export default withRouter(App);
