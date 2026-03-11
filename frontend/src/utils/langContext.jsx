import { createContext, useContext, useState } from "react";
import { translations } from "./translations";

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem("volt_lang") || "pt-BR"
  );

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("volt_lang", newLang);
  };

  const t = (key) => translations[lang]?.[key] || key;

  return (
    <LangContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}