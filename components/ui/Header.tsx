'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Calculator, Target } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const NAVIGATION_ITEMS = [
  { label: 'Chi siamo', href: '#chi-siamo' },
  { label: 'Servizi', href: '#servizi' },
  { label: 'Come funziona', href: '#come-funziona' },
  { label: 'Calcola Trasformazione', href: '#calcolatore', icon: Calculator, highlight: true },
  { label: 'Testimonianze', href: '#testimonianze' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contatti', href: '#contatti' },

  // 🔥 Nuovo link BLOG come pagina
  { label: 'Blog', href: '/blog', external: true }
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);

    // Se è pagina esterna → non smooth scroll
    if (href.startsWith('/')) return;

    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg py-2'
          : 'bg-white/95 backdrop-blur-sm py-3'
      }`}
    >
      <div className="container-custom mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={scrollToTop}
          className="flex items-center transition-transform hover:scale-105 mr-8"
        >
          <Image
            src="/images/logo/logo-tribu.png"
            alt="Tribù Personal Training Studio"
            width={180}
            height={60}
            className="h-12 md:h-14 w-auto cursor-pointer"
            priority
          />
        </button>

        {/* DESKTOP MENU */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {NAVIGATION_ITEMS.map((item) =>
            item.external ? (
              // 🔥 Link a pagina esterna (/blog)
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors duration-300 font-medium text-sm xl:text-base text-gray hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              // Smooth scroll (ancora interno)
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`transition-colors duration-300 font-medium text-sm xl:text-base flex items-center gap-1 ${
                  item.highlight
                    ? 'text-orange-500 hover:text-orange-600'
                    : 'text-gray hover:text-primary'
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
              </a>
            )
          )}

          {/* Quiz Button */}
          <Link
            href="/quiz"
            className="flex items-center gap-1 text-orange-500 hover:text-orange-600 transition-colors duration-300 font-medium text-sm xl:text-base"
          >
            <Target className="w-4 h-4" />
            Trova il Tuo Percorso
          </Link>

          <button
            onClick={() =>
              document
                .getElementById('contatti')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="bg-primary text-white px-5 py-2 rounded-full font-semibold hover:bg-primary-dark transition-all duration-300 hover:scale-105 text-sm xl:text-base"
          >
            PRENOTA ORA
          </button>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-gray hover:text-primary transition-colors"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden bg-white border-t transition-all duration-300 ${
          isMenuOpen
            ? 'max-h-screen opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <nav className="container-custom mx-auto px-4 py-4 flex flex-col space-y-4">
          {NAVIGATION_ITEMS.map((item) =>
            item.external ? (
              // 🔥 Blog in mobile → chiude menu
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="transition-colors duration-300 font-medium py-2 flex items-center gap-2 text-gray hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`transition-colors duration-300 font-medium py-2 flex items-center gap-2 ${
                  item.highlight
                    ? 'text-orange-500 hover:text-orange-600'
                    : 'text-gray hover:text-primary'
                }`}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                {item.label}
              </a>
            )
          )}

          {/* Quiz Mobile */}
          <Link
            href="/quiz"
            onClick={() => setIsMenuOpen(false)}
            className="text-orange-500 hover:text-orange-600 transition-colors duration-300 font-medium py-2 flex items-center gap-2"
          >
            <Target className="w-5 h-5" />
            Trova il Tuo Percorso
          </Link>

          <button
            onClick={() => {
              setIsMenuOpen(false);
              document
                .getElementById('contatti')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-dark transition-all duration-300 w-full"
          >
            PRENOTA ORA
          </button>
        </nav>
      </div>
    </header>
  );
}
