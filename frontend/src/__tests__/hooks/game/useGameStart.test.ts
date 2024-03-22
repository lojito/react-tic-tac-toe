import { renderHook } from "@testing-library/react-hooks";
import useGameStart from "../../../hooks/game/useGameStart";

describe("useGameStart", () => {
  it("should call the init handler", () => {
    const dispatch = jest.fn();

    const { result } = renderHook(() => useGameStart(dispatch));
    result.current.handleGameStart();

    expect(dispatch).toBeCalled();
  });
});
