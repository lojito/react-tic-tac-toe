import { act, renderHook } from "@testing-library/react-hooks";
import mockAxios from "axios";
import useSaveGame from "../../../hooks/game/useSaveGame";
import { DBGame } from "../../../types";

describe("useSaveGame", () => {
  const url = `http://localhost:4000/api/games/`;
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI";
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const mockGameAboutToSave: DBGame = {
    board: [2, 2, 2, 0, 1, 1, 1, 0, 1],
    categoryId: 5,
    first: 1,
    computerImage: 4,
    userImage: 3,
    level: 1,
    result: 3,
    winners: [0, 1, 2],
  };

  const mockAjaxResponse = {
    data: {
      game: {
        board: [2, 2, 2, 0, 1, 1, 1, 0, 1],
        categoryId: 5,
        first: 1,
        computerImage: 4,
        userImage: 3,
        level: 1,
        result: 3,
        winners: [0, 1, 2],
        createAt: "2022-11-17T08:06:44.235Z",
        updatedAt: "2022-11-17T08:06:44.235Z",
        user: "636048af80d558d24d56265e",
        _v: 0,
        _id: "6375eb94d88e80252fe89e50",
      },
      message: "Game created",
      user: {
        name: "livan",
        _id: "636048af80d558d24d56265e",
      },
    },
  };

  it("should not update the state if the component unmounts", async () => {
    (mockAxios.post as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(mockAjaxResponse)
    );

    const { result, unmount } = renderHook(() => useSaveGame(token));
    act(() => {
      result.current.handleSaveGame(mockGameAboutToSave);
      unmount();
    });

    expect(mockAxios.post).toBeCalledTimes(1);
    expect(mockAxios.post).toHaveBeenCalledWith(
      url,
      mockGameAboutToSave,
      headers
    );
    expect(result.current.error).toBe("");
  });

  it("should save the game", async () => {
    (mockAxios.post as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(mockAjaxResponse)
    );

    const { result } = renderHook(() => useSaveGame(token));
    act(() => {
      result.current.handleSaveGame(mockGameAboutToSave);
    });

    expect(mockAxios.post).toBeCalledTimes(1);
    expect(mockAxios.post).toHaveBeenCalledWith(
      url,
      mockGameAboutToSave,
      headers
    );
    expect(result.current.error).toBe("");
  });

  it("should error while trying to save the game", async () => {
    const error = "Error while saving the game info to the database";
    (mockAxios.post as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error(error))
    );

    const { result, waitForNextUpdate } = renderHook(() => useSaveGame(token));
    act(() => {
      result.current.handleSaveGame(mockGameAboutToSave);
    });
    await waitForNextUpdate();

    expect(mockAxios.post).toBeCalledTimes(1);
    expect(mockAxios.post).toHaveBeenCalledWith(
      url,
      mockGameAboutToSave,
      headers
    );
    expect(result.current.error).toBe(error);
  });
});
