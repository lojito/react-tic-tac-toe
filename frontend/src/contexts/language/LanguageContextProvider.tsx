import React, { FC } from "react";
import useLanguage from "../../hooks/useLanguage";
import { Language, LanguageContext } from "./LanguageContext";

const LanguageContextProvider: FC = ({ children }) => {
  const { language, handleChangeLanguage } = useLanguage(Language.English);

  return (
    <LanguageContext.Provider value={{ language, handleChangeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContextProvider;
