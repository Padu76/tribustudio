// lib/i18n/LanguageProvider.tsx
"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { translations, type Locale } from "./translations";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (section: string, key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "it",
  setLocale: () => {},
  t: () => "",
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("it");

  // Carica lingua salvata
  useEffect(() => {
    const saved = localStorage.getItem("tribu-lang") as Locale | null;
    if (saved && (saved === "it" || saved === "en")) {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("tribu-lang", newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  // Funzione di traduzione: t("nav", "chiSiamo") => "Chi siamo" o "About Us"
  const t = useCallback(
    (section: string, key: string): string => {
      const sectionData = translations[section as keyof typeof translations];
      if (!sectionData) return key;
      const entry = (sectionData as Record<string, Record<Locale, string>>)[key];
      if (!entry) return key;
      return entry[locale] || entry["it"] || key;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
