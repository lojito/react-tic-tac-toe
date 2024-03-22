import { renderHook } from "@testing-library/react-hooks";
import useAuthLocalStorage from "../../../hooks/auth/useAuthLocalStorage";

describe("useAuthLocalStorage", () => {
  const setup = () => {
    const authItems = {
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxpdmFub2ppdG9AZ21haWwuY29tIiwidXNlcklkIjoiNjM2MDQ4YWY4MGQ1NThkMjRkNTYyNjVlIiwiaWF0IjoxNjY5MzYyMDQxLCJleHAiOjE2NjkzNjU2NDF9.GsPpPfBlyii1QhtexcuLV7MPueYZnJLLB7O4sz4H-Ik",
      name: "Livan",
      expirationDate: "2022-11-25T08:40:41.645Z",
      userId: "636048af80d558d24d56265e",
    };

    const { result } = renderHook(() => useAuthLocalStorage());
    result.current.setAuthItems(authItems);

    return {
      authItems,
      result,
    };
  };

  it("should remove the auth items from the local storage", () => {
    const authInitItems = {
      token: null,
      name: null,
      expirationDate: null,
      userId: null,
    };
    const { result } = setup();

    result.current.removeAuthItems();

    expect(result.current.getAuthItems()).toEqual(authInitItems);
  });

  it("should get the auth items from the local storage", () => {
    const { authItems, result } = setup();

    expect(result.current.getAuthItems()).toEqual(authItems);
  });
});
