import { act, renderHook } from "@testing-library/react-hooks";
import { Language } from "../../contexts/language/LanguageContext";
import useLanguage from "../../hooks/useLanguage";

describe("useLanguage", () => {
  it("should default the language", () => {
    const { result } = renderHook(() => useLanguage(Language.English));

    expect(result.current.language).toBe(Language.English);
  });

  it("should set the language", () => {
    const { result } = renderHook(() => useLanguage(Language.French));

    expect(result.current.language).toBe(Language.French);
  });

  it("should change the language", () => {
    const { result } = renderHook(() => useLanguage(Language.English));

    act(() => {
      result.current.handleChangeLanguage(Language.French);
    });

    expect(result.current.language).toBe(Language.French);
  });
});
