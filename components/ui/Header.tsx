// components/ui/Header.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X, Dumbbell, ChevronDown, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

// Sotto-voci del dropdown "Studio"
const STUDIO_DROPDOWN = [
  { labelKey: 'chiSiamo', href: '#chi-siamo' },
  { labelKey: 'servizi', href: '#servizi' },
  { labelKey: 'galleria', href: '#galleria' },
  { labelKey: 'comeFunziona', href: '#come-funziona' },
  { labelKey: 'faq', href: '#faq' },
];

// Voci principali del menu (senza dropdown)
interface NavItem {
  labelKey: string;
  href: string;
  external?: boolean;
  badgeKey?: string;
  icon?: React.ElementType;
}

const MAIN_NAV_ITEMS: NavItem[] = [
  { labelKey: 'serviziFitness', href: '/servizi-fitness', external: true },
  { labelKey: 'serviziBenessere', href: '/servizi-benessere', external: true },
  { labelKey: 'privateGym', href: '/private-gym', external: true, badgeKey: 'nuovo', icon: Dumbbell },
  { labelKey: 'blog', href: '/blog', external: true },
];

export default function Header() {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileStudioOpen, setIsMobileStudioOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = STUDIO_DROPDOWN
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

  // Chiudi dropdown quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setIsMobileStudioOpen(false);
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
    <>
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
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Dropdown Studio */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isDropdownOpen
                    ? 'text-primary bg-primary/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {t("nav", "studio")}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Menu a tendina */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px] z-50">
                  {STUDIO_DROPDOWN.map((item) => {
                    const isActive = item.href.startsWith('#') && activeSection === item.href.substring(1);
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(item.href);
                        }}
                        className={`block px-4 py-2.5 text-sm transition-colors ${
                          isActive
                            ? 'text-primary bg-primary/5 font-semibold'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {t("nav", item.labelKey)}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Voci principali */}
            {MAIN_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  item.badgeKey
                    ? 'text-primary hover:bg-primary/5 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.icon && <item.icon className="w-3.5 h-3.5" />}
                {t("nav", item.labelKey)}
                {item.badgeKey && (
                  <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none tracking-wide">
                    {t("nav", item.badgeKey)}
                  </span>
                )}
              </Link>
            ))}

            <div className="w-px h-6 bg-gray-200 mx-1" />
            <LanguageSwitcher />

            <button
              onClick={() =>
                window.open('https://wa.me/393478881515?text=Ciao!%20Vorrei%20prenotare%20una%20lezione.', '_blank')
              }
              className="ml-1 bg-gradient-to-r from-primary to-primary-dark text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] whitespace-nowrap"
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
      </header>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-white overflow-y-auto"
          style={{ zIndex: 9999, paddingTop: '56px' }}
        >
          <nav className="px-6 py-6 flex flex-col" style={{ minHeight: 'calc(100vh - 56px)' }}>
            <div className="flex-1 space-y-1">
              {/* Dropdown Studio - Mobile */}
              <div>
                <button
                  onClick={() => setIsMobileStudioOpen(!isMobileStudioOpen)}
                  className="flex items-center justify-between w-full py-3.5 px-4 rounded-xl transition-all duration-200 text-gray-700 hover:bg-gray-50 text-base font-semibold"
                >
                  <span>{t("nav", "studio")}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isMobileStudioOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMobileStudioOpen && (
                  <div className="ml-4 space-y-0.5 mb-2">
                    {STUDIO_DROPDOWN.map((item) => {
                      const isActive = item.href.startsWith('#') && activeSection === item.href.substring(1);
                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(item.href);
                          }}
                          className={`flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-200 text-sm ${
                            isActive
                              ? 'text-primary bg-primary/5 font-semibold'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <span>{t("nav", item.labelKey)}</span>
                          {isActive && <div className="w-2 h-2 bg-primary rounded-full" />}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Voci principali - Mobile */}
              {MAIN_NAV_ITEMS.map((item) => (
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
                    {t("nav", item.labelKey)}
                    {item.badgeKey && (
                      <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-none">
                        {t("nav", item.badgeKey)}
                      </span>
                    )}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </div>

            {/* CTA in basso */}
            <div className="pt-4 pb-8">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  window.open('https://wa.me/393478881515?text=Ciao!%20Vorrei%20prenotare%20una%20lezione.', '_blank');
                }}
                className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-4 rounded-full font-bold text-base hover:shadow-lg transition-all duration-300 w-full whitespace-nowrap"
              >
                {t("nav", "prenota")}
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
