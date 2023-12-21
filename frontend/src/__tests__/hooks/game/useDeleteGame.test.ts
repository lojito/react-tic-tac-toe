import { act, renderHook } from "@testing-library/react-hooks";
import mockAxios from "axios";
import useDeleteGame from "../../../hooks/game/useDeleteGame";
import { DBGame, GameResult, Player, PlayingLevel } from "../../../types";

describe("useDeleteGame", () => {
  const gameId = "6354074f46bfb3571fe98ebc";
  const url = `http://localhost:4000/api/games/${gameId}`;
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI";
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const mockAjaxResponse: { data: DBGame } = {
    data: {
      _id: gameId,
      board: [2, 2, 2, 0, 1, 1, 1, 0, 1],
      categoryId: 5,
      first: Player.User,
      computerImage: 4,
      userImage: 3,
      level: PlayingLevel.Smart,
      result: GameResult.Won,
      winners: [0, 1, 2],
      createdAt: "2022-10-22T15:07:59.495Z",
      updatedAt: "2022-10-22T15:07:59.495Z",
      __v: 0,
    },
  };

  it("should not update the state if the component unmounts", async () => {
    (mockAxios.delete as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(mockAjaxResponse)
    );

    const { result, unmount } = renderHook(() => useDeleteGame(token));
    act(() => {
      result.current.handleDeleteGame(gameId);
      unmount();
    });

    expect(mockAxios.delete).toBeCalledTimes(1);
    expect(mockAxios.delete).toHaveBeenCalledWith(url, headers);
    expect(result.current.error).toBeFalsy();
    expect(result.current.gameId).not.toBe(gameId);
  });

  it("should delete the game", async () => {
    (mockAxios.delete as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(mockAjaxResponse)
    );

    const { result, waitForNextUpdate } = renderHook(() =>
      useDeleteGame(token)
    );
    act(() => {
      result.current.handleDeleteGame(gameId);
    });
    await waitForNextUpdate();

    expect(mockAxios.delete).toBeCalledTimes(1);
    expect(mockAxios.delete).toHaveBeenCalledWith(url, headers);
    expect(result.current.error).toBeFalsy();
    expect(result.current.gameId).toBe(gameId);
  });

  it("should error while trying to delete the game", async () => {
    const error = "Error while deleting the game from the database.";
    (mockAxios.delete as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error(error))
    );

    const { result, waitForNextUpdate } = renderHook(() =>
      useDeleteGame(token)
    );
    act(() => {
      result.current.handleDeleteGame(gameId);
    });
    await waitForNextUpdate();

    expect(mockAxios.delete).toBeCalledTimes(1);
    expect(mockAxios.delete).toHaveBeenCalledWith(url, headers);
    expect(result.current.error).toBeTruthy();
    expect(result.current.gameId).toBe(gameId);
  });
});
