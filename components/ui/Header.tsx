// components/ui/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Dumbbell, Camera, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

// Voci di navigazione — Calcolatore rimosso, aggiunti Galleria e Private Gym
interface NavItem {
  labelKey: string;
  href: string;
  external?: boolean;
  badgeKey?: string;
  icon?: React.ElementType;
}

const NAVIGATION_ITEMS: NavItem[] = [
  { labelKey: 'chiSiamo', href: '#chi-siamo' },
  { labelKey: 'servizi', href: '#servizi' },
  { labelKey: 'galleria', href: '#galleria', icon: Camera },
  { labelKey: 'comeFunziona', href: '#come-funziona' },
  { labelKey: 'privateGym', href: '/private-gym', external: true, badgeKey: 'nuovo', icon: Dumbbell },
  { labelKey: 'testimonianze', href: '#testimonianze' },
  { labelKey: 'faq', href: '#faq' },
  { labelKey: 'blog', href: '/blog', external: true },
  { labelKey: 'contatti', href: '#contatti' },
];

export default function Header() {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Traccia sezione attiva per highlight nel menu
      const sections = NAVIGATION_ITEMS
        .filter(item => item.href.startsWith('#'))
        .map(item => item.href.substring(1));

      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith('/')) return;
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  // Blocca scroll body quando menu mobile è aperto
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg shadow-black/5 py-2'
          : 'bg-white/95 backdrop-blur-sm py-3'
      }`}
    >
      <div className="container-custom mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={scrollToTop}
          className="flex items-center transition-transform hover:scale-105 mr-6 flex-shrink-0"
        >
          <Image
            src="/images/logo/logo-tribu.png"
            alt="Tribù Personal Training Studio"
            width={180}
            height={60}
            className="h-11 md:h-[52px] w-auto cursor-pointer"
            priority
          />
        </button>

        {/* DESKTOP MENU */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = item.href.startsWith('#') && activeSection === item.href.substring(1);
            const label = t("nav", item.labelKey);

            if (item.external) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 xl:px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    item.badgeKey
                      ? 'text-primary hover:bg-primary/5 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.icon && <item.icon className="w-3.5 h-3.5" />}
                  {label}
                  {item.badgeKey && (
                    <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none tracking-wide">
                      {t("nav", item.badgeKey)}
                    </span>
                  )}
                </Link>
              );
            }

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`relative px-3 xl:px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 group ${
                  isActive
                    ? 'text-primary bg-primary/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.icon && <item.icon className="w-3.5 h-3.5" />}
                {label}
                {/* Underline animata */}
                <span className={`absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full transition-transform duration-300 origin-left ${
                  isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </a>
            );
          })}

          {/* Separatore verticale */}
          <div className="w-px h-6 bg-gray-200 mx-1" />

          {/* Language switcher */}
          <LanguageSwitcher />

          {/* CTA Prenota */}
          <button
            onClick={() =>
              document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="ml-1 bg-gradient-to-r from-primary to-primary-dark text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            {t("nav", "prenota")}
          </button>
        </nav>

        {/* MOBILE: Language + Menu */}
        <div className="lg:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-primary transition-colors p-2 -mr-2"
            aria-label={isMenuOpen ? t("nav", "chiudiMenu") : t("nav", "apriMenu")}
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU — Full screen solido */}
      {isMenuOpen && (
      <div
        className="lg:hidden fixed inset-x-0 top-[56px] bottom-0 z-[9999] bg-white overflow-y-auto"
        style={{ position: 'fixed' }}
      >
        <nav className="px-6 py-6 flex flex-col min-h-full">
          <div className="flex-1 space-y-1">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = item.href.startsWith('#') && activeSection === item.href.substring(1);
              const label = t("nav", item.labelKey);

              if (item.external) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between py-3.5 px-4 rounded-xl transition-all duration-200 ${
                      item.badgeKey
                        ? 'text-primary bg-primary/5 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-3 text-base">
                      {item.icon && <item.icon className="w-5 h-5" />}
                      {label}
                      {item.badgeKey && (
                        <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-none">
                          {t("nav", item.badgeKey)}
                        </span>
                      )}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                );
              }

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`flex items-center justify-between py-3.5 px-4 rounded-xl transition-all duration-200 text-base ${
                    isActive
                      ? 'text-primary bg-primary/5 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {item.icon && <item.icon className="w-5 h-5" />}
                    {label}
                  </span>
                  {isActive && <div className="w-2 h-2 bg-primary rounded-full" />}
                </a>
              );
            })}

          </div>

          {/* CTA fisso in basso */}
          <div className="pt-4 pb-8">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-4 rounded-full font-bold text-base hover:shadow-lg transition-all duration-300 w-full"
            >
              {t("nav", "prenota")}
            </button>
          </div>
        </nav>
      </div>
      )}
    </header>
  );
}
