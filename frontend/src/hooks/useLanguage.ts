import { useCallback, useState } from "react";
import { Language } from "../contexts/language/LanguageContext";

function useLanguage(lang: Language) {
  const [language, setLanguage] = useState(lang);

  const handleChangeLanguage = useCallback((language: Language) => {
    setLanguage(language);
  }, []);

  return { language, handleChangeLanguage };
}

export default useLanguage;
