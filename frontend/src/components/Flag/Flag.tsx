import React, { FC, useContext } from "react";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import {
  Language,
  LanguageContext,
} from "../../contexts/language/LanguageContext";

import franceFlag from "../../assets/images/france.jpg";
import spainFlag from "../../assets/images/spain.jpg";
import usaFlag from "../../assets/images/usa.jpg";
import "./Flag.scss";

const Flag: FC = () => {
  const { language, handleChangeLanguage } = useContext(LanguageContext);
  const {
    dictionary: { FLAG_ENGLISH_HINT, FLAG_FRENCH_HINT, FLAG_SPANISH_HINT },
  } = useContext(DictionaryContext);

  return (
    <header>
      <div className="flags" data-testid="flags">
        <img
          src={usaFlag}
          style={{ opacity: language === Language.English ? "0.5" : 1 }}
          onClick={() => {
            handleChangeLanguage!(Language.English);
          }}
          alt={FLAG_ENGLISH_HINT}
          title={FLAG_ENGLISH_HINT}
        />
        <img
          data-testid="livan"
          src={franceFlag}
          style={{ opacity: language === Language.French ? "0.5" : 1 }}
          onClick={() => {
            handleChangeLanguage!(Language.French);
          }}
          alt={FLAG_FRENCH_HINT}
          title={FLAG_FRENCH_HINT}
        />
        <img
          src={spainFlag}
          style={{ opacity: language === Language.Spanish ? "0.5" : 1 }}
          onClick={() => {
            handleChangeLanguage!(Language.Spanish);
          }}
          alt={FLAG_SPANISH_HINT}
          title={FLAG_SPANISH_HINT}
        />
      </div>
    </header>
  );
};

export default Flag;
