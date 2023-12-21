import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Account } from "../../components/Auth/AuthForm";
import useAuthLocalStorage from "../../hooks/auth/useAuthLocalStorage";
import useMounted from "../useMounted";

interface AuthState {
  isLoggedIn: boolean;
  isSignedUp: boolean;
  token: string;
  userId: string;
  name: string;
  error: string;
}

const initAuthState = {
  isLoggedIn: false,
  isSignedUp: false,
  token: "",
  userId: "",
  name: "",
  error: "",
};

function useAuth() {
  const isMounted = useMounted();
  const [auth, setAuth] = useState<AuthState>({ ...initAuthState });
  const { setAuthItems, getAuthItems, removeAuthItems } = useAuthLocalStorage();

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
    const { token, expirationDate, userId, name } = getAuthItems();
    if (!token || !expirationDate || !userId || !name) {
      return;
    }
    if (new Date(expirationDate) <= new Date()) {
      handleLogout();
      return;
    }
    const remainingMilliseconds =
      new Date(expirationDate).getTime() - new Date().getTime();
    updateState({
      isLoggedIn: true,
      isSignedUp: false,
      token,
      userId,
      name,
      error: "",
    });
    logoutAfter(remainingMilliseconds);
  }, [logoutAfter, handleLogout, getAuthItems, updateState]);

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
          isLoggedIn: authType === "login" ? true : false,
          isSignedUp: authType === "signup" ? true : false,
          token: "",
          ...res.data,
          error: "",
        });
        if (authType === "login") {
          const remainingMilliseconds = 60 * 60 * 1000;
          const expirationDate = new Date(
            new Date().getTime() + remainingMilliseconds
          );
          setAuthItems({
            ...res.data,
            expirationDate: expirationDate.toISOString(),
          });
          logoutAfter(remainingMilliseconds);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (!err?.response) {
            updateState({
              ...initAuthState,
              error: "Server is not responding!",
            });
          } else if (
            err.response?.status === 401 ||
            err.response?.status === 422
          ) {
            updateState({
              ...initAuthState,
              error:
                "Validation failed! Check again the e-mail and the password",
            });
          } else {
            updateState({
              ...initAuthState,
              error:
                "There was an error while trying to login or signup in the user.",
            });
          }
        } else {
          updateState({
            ...initAuthState,
            error: "Unknow error!",
          });
        }
      }
    },
    [logoutAfter, setAuthItems, updateState]
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
