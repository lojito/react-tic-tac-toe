import React, { FC, useContext } from "react";
import data from "../../data/json/dictionary.json";
import { LanguageContext } from "../language/LanguageContext";
import {
  DictionaryContext,
  DictionaryContextValue,
  DictionaryEntry,
} from "./DictionaryContext";

const DictionaryContextProvider: FC = ({ children }) => {
  const { language } = useContext(LanguageContext);

  const ctx: DictionaryContextValue = {
    dictionary: data[language] as DictionaryEntry,
  };

  return (
    <DictionaryContext.Provider value={ctx}>
      {children}
    </DictionaryContext.Provider>
  );
};

export default DictionaryContextProvider;
