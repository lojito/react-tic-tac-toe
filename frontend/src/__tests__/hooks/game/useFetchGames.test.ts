import { act, renderHook } from "@testing-library/react-hooks";
import mockAxios from "axios";
import useFetchGames from "../../../hooks/game/useFetchGames";
import { DBGame, GameResult, Player, PlayingLevel } from "../../../types";

describe("useFetchGames", () => {
  const gameId1 = "6354074f46bfb3571fe98ebc";
  const gameId2 = "6354070046bfb3571fe98eb6";
  const url = "http://localhost:4000/api/games";
  const token = "token";
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const mockAjaxResponse: Array<DBGame> = [
    {
      _id: gameId1,
      board: [2, 2, 2, 0, 1, 1, 1, 0, 1],
      categoryId: 5,
      first: Player.User,
      computerImage: 4,
      userImage: 3,
      level: PlayingLevel.Smart,
      result: GameResult.Lost,
      winners: [0, 1, 2],
      createdAt: "2022-10-22T15:07:59.495Z",
      updatedAt: "2022-10-22T15:07:59.495Z",
      __v: 0,
    },
    {
      _id: gameId2,
      board: [2, 1, 1, 2, 1, 0, 2, 1, 0],
      categoryId: 5,
      first: Player.Computer,
      computerImage: 6,
      userImage: 16,
      level: PlayingLevel.Easy,
      result: GameResult.Won,
      winners: [0, 3, 6],
      createdAt: "2022-10-22T15:06:40.803Z",
      updatedAt: "2022-10-22T15:06:40.803Z",
      __v: 1,
    },
  ];

  it("should not update the state if the component unmounts", async () => {
    (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: mockAjaxResponse })
    );

    const { result, unmount } = renderHook(() => useFetchGames(token));
    act(() => {
      result.current.handleFetchGames();
      unmount();
    });

    expect(mockAxios.get).toBeCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(url, headers);
    expect(result.current.games).toEqual(null);
  });

  it("should fetch the games", async () => {
    (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: mockAjaxResponse })
    );

    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchGames(token)
    );
    act(() => {
      result.current.handleFetchGames();
    });
    await waitForNextUpdate();

    expect(mockAxios.get).toBeCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(url, headers);
    expect(result.current.games).toEqual(mockAjaxResponse);
  });

  it("should fetch no games", async () => {
    (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: [] })
    );

    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchGames(token)
    );
    act(() => {
      result.current.handleFetchGames();
    });
    await waitForNextUpdate();

    expect(mockAxios.get).toBeCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(url, headers);
    expect(result.current.games).toEqual([]);
  });

  it("should error while trying to fetch the games", async () => {
    const error =
      "Error while fetching the games historical from the database.";
    (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error(error))
    );

    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchGames(token)
    );
    act(() => {
      result.current.handleFetchGames();
    });
    await waitForNextUpdate();

    expect(mockAxios.get).toBeCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(url, headers);
    expect(result.current.error).toBeTruthy();
  });

  it("should remove only one game", async () => {
    (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: mockAjaxResponse })
    );

    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchGames(token)
    );
    act(() => {
      result.current.handleFetchGames();
    });
    await waitForNextUpdate();
    act(() => {
      result.current.handleRemoveGame(gameId1);
    });

    expect(result.current.games!).toHaveLength(mockAjaxResponse.length - 1);
  });

  it("should not error when trying to remove a game that was previously removed", async () => {
    (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: mockAjaxResponse })
    );

    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchGames(token)
    );
    act(() => {
      result.current.handleFetchGames();
    });
    await waitForNextUpdate();
    act(() => {
      result.current.handleRemoveGame(gameId1);
    });
    act(() => {
      result.current.handleRemoveGame(gameId1);
    });

    expect(result.current.error).toBeFalsy();
  });

  it("should remove all games", async () => {
    (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: mockAjaxResponse })
    );

    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchGames(token)
    );
    act(() => {
      result.current.handleFetchGames();
    });
    await waitForNextUpdate();
    act(() => {
      result.current.handleRemoveGame(gameId1);
    });
    act(() => {
      result.current.handleRemoveGame(gameId2);
    });

    expect(result.current.games).toBeNull();
  });

  it("should not remove any game", async () => {
    (mockAxios.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: [] })
    );

    const { result } = renderHook(() => useFetchGames(token));
    act(() => {
      result.current.handleRemoveGame(gameId1);
    });

    expect(result.current.games).toBeNull();
  });
});
