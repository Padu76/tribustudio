// components/private-gym/HeaderNav.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import Link from "next/link";

function DropdownMenu({
  label,
  items,
}: {
  label: string;
  items: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-medium text-white/75 transition hover:text-white"
      >
        {label}
        <svg
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl py-2 shadow-xl min-w-[180px]">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const progettoItems = [
    { href: "#come-funziona", label: t("pgNav", "comeFunziona") },
    { href: "#regole", label: t("pgNav", "regole") },
    { href: "#costi", label: t("pgNav", "costi") },
    { href: "#faq", label: t("pgNav", "faq") },
  ];

  const studioItems = [
    { href: "#postazioni", label: t("pgNav", "postazioni") },
    { href: "#attrezzature", label: t("pgNav", "attrezzature") },
  ];

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center rounded-lg p-2 text-white/70 transition hover:text-white"
        aria-label="Menu"
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full border-b border-white/10 bg-black/95 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-4 space-y-1">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
              {t("pgNav", "ilProgetto")}
            </div>
            {progettoItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}

            <div className="mt-3 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
              {t("pgNav", "loStudio")}
            </div>
            {studioItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}

            <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-3">
              <div className="flex items-center gap-3">
                <LanguageSwitcher className="!border-white/20 !bg-white/10 !text-white/80" />
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="text-sm text-white/50 hover:text-white transition"
                >
                  ← Tribù Studio
                </Link>
              </div>
              <a
                href="#calendario"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                {t("pgNav", "prenotaOra")}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HeaderNav() {
  const { t } = useLanguage();

  const progettoItems = [
    { href: "#come-funziona", label: t("pgNav", "comeFunziona") },
    { href: "#regole", label: t("pgNav", "regole") },
    { href: "#costi", label: t("pgNav", "costi") },
    { href: "#faq", label: t("pgNav", "faq") },
  ];

  const studioItems = [
    { href: "#postazioni", label: t("pgNav", "postazioni") },
    { href: "#attrezzature", label: t("pgNav", "attrezzature") },
  ];

  return (
    <>
      {/* Desktop */}
      <nav className="hidden items-center gap-6 lg:flex">
        <DropdownMenu label={t("pgNav", "ilProgetto")} items={progettoItems} />
        <DropdownMenu label={t("pgNav", "loStudio")} items={studioItems} />
        <a href="#calendario" className="text-sm font-medium text-white/75 transition hover:text-white">
          {t("pgNav", "calendario")}
        </a>
        <Link href="/" className="text-sm text-white/50 hover:text-white transition">
          ← Tribù Studio
        </Link>
        <LanguageSwitcher className="!border-white/20 !bg-white/10 !text-white/80" />
      </nav>

      {/* Mobile */}
      <MobileMenu />
    </>
  );
}
