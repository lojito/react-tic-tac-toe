import { renderHook } from "@testing-library/react-hooks";
import useGameInit from "../../hooks/useGameInit";

describe("useGameInit", () => {
  it("should call the init handler", () => {
    const dispatch = jest.fn();

    const { result } = renderHook(() => useGameInit(dispatch));
    result.current.handleGameInit();

    expect(dispatch).toBeCalled();
  });
});
