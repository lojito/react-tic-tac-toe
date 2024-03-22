import { act, renderHook } from "@testing-library/react-hooks";
import mockAxios from "axios";
import { Account } from "../../../components/Auth/AuthForm";
import useAuth from "../../../hooks/auth/useAuth";
import * as useAuthLocalStorage from "../../../hooks/auth/useAuthLocalStorage";

jest.mock("../../../hooks/auth/useAuthLocalStorage", () => ({
  __esModule: true,
  default: () => ({
    setAuthItems: jest.fn(),
    getAuthItems: () => ({
      token: "",
      expirationDate: "",
      userId: "",
      name: "",
    }),
    removeAuthItems: jest.fn(),
  }),
}));

describe("useAuth", () => {
  const mockAccount: Account = {
    email: "livanojito@gmail.com",
    password: "livan",
    name: "Livan",
  };

  const mockAjaxLogInResponse = {
    data: {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxpdmFub2ppd",
      name: "Livan",
      userId: "636048af80d558d24d56265e",
    },
  };

  const mockAjaxSignUpResponse = {
    data: {
      token: "",
      name: "Livan",
      userId: "636048af80d558d24d56265e",
    },
  };

  interface AxiosError extends Error {
    response: { status: number };
    isAxiosError?: boolean;
  }

  it("should not update the state if the component unmounts", async () => {
    const url = `http://localhost:4000/api/auth/login`;
    (mockAxios.post as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(mockAjaxLogInResponse)
    );

    const { result, unmount } = renderHook(() => useAuth());
    act(() => {
      result.current.handleLogin(mockAccount);
      unmount();
    });

    expect(mockAxios.post).toBeCalledTimes(1);
    expect(mockAxios.post).toHaveBeenCalledWith(url, mockAccount);
    expect(result.current.name).toBe("");
    expect(result.current.token).toBe("");
    expect(result.current.userId).toBe("");
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.isSignedUp).toBe(false);
    expect(result.current.error).toBe("");
  });

  it("should log in the user", async () => {
    const url = `http://localhost:4000/api/auth/login`;
    (mockAxios.post as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(mockAjaxLogInResponse)
    );

    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    act(() => {
      result.current.handleLogin(mockAccount);
    });
    await waitForNextUpdate();

    expect(mockAxios.post).toBeCalledTimes(1);
    expect(mockAxios.post).toHaveBeenCalledWith(url, mockAccount);
    expect(result.current).toEqual({
      ...mockAjaxLogInResponse.data,
      isLoggedIn: true,
      isSignedUp: false,
      error: "",
      handleLogin: result.current.handleLogin,
      handleSignup: result.current.handleSignup,
      handleLogout: result.current.handleLogout,
    });
  });

  it("should sign up the user", async () => {
    const url = `http://localhost:4000/api/auth/signup`;
    (mockAxios.put as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(mockAjaxSignUpResponse)
    );

    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    act(() => {
      result.current.handleSignup(mockAccount);
    });
    await waitForNextUpdate();

    expect(mockAxios.put).toBeCalledTimes(1);
    expect(mockAxios.put).toHaveBeenCalledWith(url, mockAccount);
    expect(result.current).toEqual({
      ...mockAjaxSignUpResponse.data,
      isLoggedIn: false,
      isSignedUp: true,
      error: "",
      handleLogin: result.current.handleLogin,
      handleSignup: result.current.handleSignup,
      handleLogout: result.current.handleLogout,
    });
  });

  it("should log out the user", async () => {
    (mockAxios.post as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(mockAjaxLogInResponse)
    );

    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    act(() => {
      result.current.handleLogin(mockAccount);
    });
    await waitForNextUpdate();

    expect(result.current.isLoggedIn).toBe(true);

    act(() => {
      result.current.handleLogout();
    });

    expect(result.current.isLoggedIn).toBe(false);
  });

  it("should logout the user when the date in the local storage has expired", async () => {
    const mockGetAuthItems = () => ({
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxpdmFub2ppd",
      userId: "636048af80d558d24d56265e",
      name: "Livan",
      expirationDate: new Date(
        new Date().getTime() - 60 * 60 * 1000
      ).toISOString(),
    });

    const { result, waitForNextUpdate } = renderHook(() => useAuth());

    (mockAxios.post as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(mockAjaxLogInResponse)
    );

    act(() => {
      result.current.handleLogin(mockAccount);
    });
    await waitForNextUpdate();

    expect(result.current.isLoggedIn).toBe(true);

    jest.spyOn(useAuthLocalStorage, "default").mockImplementationOnce(() => ({
      setAuthItems: jest.fn(),
      getAuthItems: mockGetAuthItems,
      removeAuthItems: jest.fn(),
    }));

    const { result: result1 } = renderHook(() => useAuth());

    expect(result1.current.isLoggedIn).toBe(false);
  });

  it("should not logout the user when the date in the local storage has not yet expired", async () => {
    const mockGetAuthItems = () => ({
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxpdmFub2ppd",
      userId: "636048af80d558d24d56265e",
      name: "Livan",
      expirationDate: new Date(
        new Date().getTime() + 60 * 60 * 1000
      ).toISOString(),
    });

    const { result, waitForNextUpdate } = renderHook(() => useAuth());

    (mockAxios.post as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(mockAjaxLogInResponse)
    );

    act(() => {
      result.current.handleLogin(mockAccount);
    });
    await waitForNextUpdate();

    expect(result.current.isLoggedIn).toBe(true);

    jest.spyOn(useAuthLocalStorage, "default").mockImplementationOnce(() => ({
      setAuthItems: jest.fn(),
      getAuthItems: mockGetAuthItems,
      removeAuthItems: jest.fn(),
    }));
    const { result: result1 } = renderHook(() => useAuth());

    expect(result1.current.isLoggedIn).toBe(true);
  });

  it("should logout the user afer a certain number of milliseconds", async () => {
    jest.useFakeTimers();

    const { result, waitForNextUpdate } = renderHook(() => useAuth());

    (mockAxios.post as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(mockAjaxLogInResponse)
    );

    act(() => {
      result.current.handleLogin(mockAccount);
    });
    await waitForNextUpdate();

    expect(result.current.isLoggedIn).toBe(true);

    act(() => {
      jest.runAllTimers();
    });
    expect(result.current.isLoggedIn).toBe(false);

    jest.useRealTimers();
  });

  it("should throw an error when the server is not responding", async () => {
    const url = `http://localhost:4000/api/auth/login`;
    const errorMsg = "Server is not responding.";
    const error = new Error(errorMsg) as AxiosError;
    error.isAxiosError = true;
    (mockAxios.post as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(error)
    );

    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    act(() => {
      result.current.handleLogin(mockAccount);
    });
    await waitForNextUpdate();

    expect(mockAxios.post).toBeCalledTimes(1);
    expect(mockAxios.post).toHaveBeenCalledWith(url, mockAccount);
    expect(result.current.error).toBe(errorMsg);
  });

  it("should throw an unauthorized error", async () => {
    const url = `http://localhost:4000/api/auth/login`;
    const errorMsg = "Validation failed. Invalid e-mail or password.";
    const error = new Error(errorMsg) as AxiosError;
    error.response = { status: 401 };
    error.isAxiosError = true;

    (mockAxios.post as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(error)
    );

    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    act(() => {
      result.current.handleLogin(mockAccount);
    });
    await waitForNextUpdate();

    expect(mockAxios.post).toBeCalledTimes(1);
    expect(mockAxios.post).toHaveBeenCalledWith(url, mockAccount);
    expect(result.current.error).toBe(errorMsg);
  });

  it("should throw an internal server error", async () => {
    const url = `http://localhost:4000/api/auth/login`;
    const errorMsg =
      "There was an error while trying to login or signup in the user.";
    const error = new Error(errorMsg) as AxiosError;
    error.response = { status: 500 };
    error.isAxiosError = true;

    (mockAxios.post as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(error)
    );

    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    act(() => {
      result.current.handleLogin(mockAccount);
    });
    await waitForNextUpdate();

    expect(mockAxios.post).toBeCalledTimes(1);
    expect(mockAxios.post).toHaveBeenCalledWith(url, mockAccount);
    expect(result.current.error).toBe(errorMsg);
  });

  it("should throw an unknow error", async () => {
    const url = `http://localhost:4000/api/auth/login`;
    const errorMsg =
      "There was an error while trying to login or signup in the user.";
    const error = new Error(errorMsg) as AxiosError;

    (mockAxios.post as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(error)
    );

    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    act(() => {
      result.current.handleLogin(mockAccount);
    });
    await waitForNextUpdate();

    expect(mockAxios.post).toBeCalledTimes(1);
    expect(mockAxios.post).toHaveBeenCalledWith(url, mockAccount);
    expect(result.current.error).toBe(errorMsg);
  });
});
