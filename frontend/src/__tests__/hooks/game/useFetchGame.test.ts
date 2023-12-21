import { act, renderHook } from "@testing-library/react-hooks";
import mockAxios from "axios";
import useFetchGame from "../../../hooks/game/useFetchGame";
import { DBGame, GameResult, Player, PlayingLevel } from "../../../types";

describe("useFetchGame", () => {
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
    (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: mockAjaxResponse })
    );

    const { result, unmount } = renderHook(() => useFetchGame(token));
    act(() => {
      result.current.handleFetchGame(gameId);
      unmount();
    });

    expect(mockAxios.get).toBeCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(url, headers);
    expect(result.current.game).toEqual(null);
  });

  it("should fetch the games", async () => {
    (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(mockAjaxResponse)
    );

    const { result, waitForNextUpdate } = renderHook(() => useFetchGame(token));
    act(() => {
      result.current.handleFetchGame(gameId);
    });
    await waitForNextUpdate();

    expect(mockAxios.get).toBeCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(url, headers);
    expect(result.current.game).toEqual(mockAjaxResponse.data);
  });

  it("should error while trying to fetch the game", async () => {
    const error = "Error while fetching the game historical from the database.";
    (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error(error))
    );

    const { result, waitForNextUpdate } = renderHook(() => useFetchGame(token));
    act(() => {
      result.current.handleFetchGame(gameId);
    });
    await waitForNextUpdate();

    expect(mockAxios.get).toBeCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(url, headers);
    expect(result.current.error).toBeTruthy();
  });
});
