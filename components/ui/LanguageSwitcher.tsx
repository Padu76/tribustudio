// components/ui/LanguageSwitcher.tsx
"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "it" ? "en" : "it")}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:scale-105 ${
        locale === "it"
          ? "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
          : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
      } ${className}`}
      aria-label={locale === "it" ? "Switch to English" : "Passa all'italiano"}
      title={locale === "it" ? "Switch to English" : "Passa all'italiano"}
    >
      <span className="text-sm leading-none">{locale === "it" ? "🇮🇹" : "🇬🇧"}</span>
      <span className="uppercase tracking-wider">{locale === "it" ? "IT" : "EN"}</span>
    </button>
  );
}
