import { renderHook } from "@testing-library/react-hooks";
import useGameOver from "../../../hooks/game/useGameOver";
import { DBGame } from "../../../types";

describe("useGameOver", () => {
  it("should call the dispatchs functions", () => {
    const dispatch = jest.fn();

    const { result } = renderHook(() => useGameOver(dispatch));
    result.current.handleGameOver({} as DBGame);

    expect(dispatch).toBeCalled();
  });
});
