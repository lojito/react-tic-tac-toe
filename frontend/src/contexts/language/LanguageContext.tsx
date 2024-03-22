import { createContext } from "react";

export enum Language {
  English,
  Spanish,
  French,
}

interface LanguageContextValue {
  language: Language;
  handleChangeLanguage?: (language: Language) => void;
}

export const LanguageContext = createContext<LanguageContextValue>({
  language: Language.English,
});
