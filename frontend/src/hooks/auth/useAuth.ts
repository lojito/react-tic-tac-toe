import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { Account } from "../../components/Auth/AuthForm";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import useAuthLocalStorage from "../../hooks/auth/useAuthLocalStorage";
import useMounted from "./useMounted";

interface AuthState {
  isLoggedIn: boolean;
  isSignedUp: boolean;
  token: string;
  userId: string;
  name: string;
  error: string;
}

const initAuthState: AuthState = {
  isLoggedIn: false,
  isSignedUp: false,
  token: "",
  userId: "",
  name: "",
  error: "",
};

function useAuth() {
  const isMounted = useMounted();
  const { setAuthItems, getAuthItems, removeAuthItems } = useAuthLocalStorage();
  const [auth, setAuth] = useState<AuthState>(() => {
    return getInitialState();
  });
  const {
    dictionary: {
      AUTH_ERROR_SERVER_NOT_RESPONDING,
      AUTH_ERROR_VALIDATION_FAILED,
      AUTH_ERROR_UNKNOWN,
    },
  } = useContext(DictionaryContext);

  const updateState = useCallback(
    (newState: AuthState) => {
      if (isMounted()) {
        setAuth({ ...newState });
      }
    },
    [isMounted]
  );

  const handleLogout = useCallback(() => {
    updateState({
      ...initAuthState,
    });
    removeAuthItems();
  }, [removeAuthItems, updateState]);

  const logoutAfter = useCallback(
    (milliseconds: number) => {
      setTimeout(() => {
        handleLogout();
      }, milliseconds);
    },
    [handleLogout]
  );

  useEffect(() => {
    const { expirationDate } = getAuthItems();
    if (!expirationDate) {
      return;
    }

    const remainingMilliseconds =
      new Date(expirationDate).getTime() - new Date().getTime();
    logoutAfter(remainingMilliseconds);
  }, [logoutAfter, getAuthItems]);

  function getInitialState() {
    const { token, expirationDate, userId, name } = getAuthItems();
    if (!token || !expirationDate || !userId || !name) {
      return initAuthState;
    }

    if (new Date(expirationDate) <= new Date()) {
      removeAuthItems();
      return {
        ...initAuthState,
      };
    }

    return {
      isLoggedIn: true,
      isSignedUp: false,
      token,
      userId,
      name,
      error: "",
    };
  }

  const handleAuth = useCallback(
    async (account: Account, authType) => {
      try {
        const res = await axios[authType === "login" ? "post" : "put"](
          `http://localhost:4000/api/auth/${authType}`,
          {
            ...account,
          }
        );

        updateState({
          isLoggedIn: authType === "login",
          isSignedUp: authType === "signup",
          token: "",
          ...res.data,
          error: "",
        });

        if (authType === "login") {
          const remainingMilliseconds = 60 * 60 * 1000;
          logoutAfter(remainingMilliseconds);

          const expirationDate = new Date(
            new Date().getTime() + remainingMilliseconds
          );
          setAuthItems({
            ...res.data,
            expirationDate: expirationDate.toISOString(),
          });
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (!err?.response) {
            updateState({
              ...initAuthState,
              error: AUTH_ERROR_SERVER_NOT_RESPONDING!,
            });
          } else if (
            err.response?.status === 401 ||
            err.response?.status === 422
          ) {
            updateState({
              ...initAuthState,
              error: AUTH_ERROR_VALIDATION_FAILED!,
            });
          } else {
            updateState({
              ...initAuthState,
              error: AUTH_ERROR_UNKNOWN!,
            });
          }
        } else {
          updateState({
            ...initAuthState,
            error: AUTH_ERROR_UNKNOWN!,
          });
        }
      }
    },
    [
      logoutAfter,
      setAuthItems,
      updateState,
      AUTH_ERROR_SERVER_NOT_RESPONDING,
      AUTH_ERROR_VALIDATION_FAILED,
      AUTH_ERROR_UNKNOWN,
    ]
  );

  const handleLogin = useCallback(
    async (account: Account) => {
      await handleAuth(account, "login");
    },
    [handleAuth]
  );

  const handleSignup = useCallback(
    async (account: Account) => {
      await handleAuth(account, "signup");
    },
    [handleAuth]
  );

  return { ...auth, handleLogin, handleSignup, handleLogout };
}

export default useAuth;
