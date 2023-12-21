import React, { FC, useContext } from "react";
import { DictionaryContext } from "../../contexts/dictionary/DictionaryContext";
import {
  Language,
  LanguageContext,
} from "../../contexts/language/LanguageContext";

import "./Flag.scss";

const Flag: FC = () => {
  const { language, handleChangeLanguage } = useContext(LanguageContext);
  const { dictionary } = useContext(DictionaryContext);

  const english = dictionary["FLAG_ENGLISH_HINT"];
  const french = dictionary["FLAG_FRENCH_HINT"];
  const spanish = dictionary["FLAG_SPANISH_HINT"];

  return (
    <header>
      <div className="flags" data-testid="flags">
        <img
          src={process.env.PUBLIC_URL + "/images/usa.jpg"}
          style={{ opacity: language === Language.English ? "0.5" : 1 }}
          onClick={() => {
            handleChangeLanguage!(Language.English);
          }}
          alt={english}
          title={english}
        />
        <img
          data-testid="livan"
          src={process.env.PUBLIC_URL + "/images/france.jpg"}
          style={{ opacity: language === Language.French ? "0.5" : 1 }}
          onClick={() => {
            handleChangeLanguage!(Language.French);
          }}
          alt={french}
          title={french}
        />
        <img
          src={process.env.PUBLIC_URL + "/images/spain.jpg"}
          style={{ opacity: language === Language.Spanish ? "0.5" : 1 }}
          onClick={() => {
            handleChangeLanguage!(Language.Spanish);
          }}
          alt={spanish}
          title={spanish}
        />
      </div>
    </header>
  );
};

export default Flag;
