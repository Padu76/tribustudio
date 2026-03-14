// components/sections/GalleriaStudio.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

const GALLERY_IMAGES = [
  { src: '/images/private-gym/studio/studio1.jpg', alt: 'Studio Tribù - Area principale' },
  { src: '/images/private-gym/studio/studio2.jpg', alt: 'Studio Tribù - Attrezzature' },
  { src: '/images/private-gym/studio/studio3.jpg', alt: 'Studio Tribù - Panoramica' },
  { src: '/images/private-gym/postazioni/postazione1.jpg', alt: 'Postazione forza' },
  { src: '/images/private-gym/postazioni/postazione2.jpg', alt: 'Postazione funzionale' },
  { src: '/images/private-gym/postazioni/postazione3.jpg', alt: 'Postazione corpo libero' },
  { src: '/images/private-gym/attrezzature/attrezzatura1.jpg', alt: 'Attrezzature professionali' },
  { src: '/images/private-gym/attrezzature/attrezzatura2.jpg', alt: 'Area allenamento' },
];

export default function GalleriaStudio() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { t } = useLanguage();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % GALLERY_IMAGES.length);
    }
  };
  const goPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
    }
  };

  return (
    <>
      <section id="galleria" className="py-16 md:py-24 px-4 md:px-8 bg-white" ref={ref}>
        <div className="container-custom mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-14"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">{t("galleria", "eyebrow")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold mt-3 mb-4">
              {t("galleria", "title").replace(t("galleria", "titleHighlight"), '')} <span className="text-primary">{t("galleria", "titleHighlight")}</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-base md:text-lg text-gray max-w-2xl mx-auto">
              {t("galleria", "subtitle")}
            </p>
          </motion.div>

          {/* Griglia foto */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {GALLERY_IMAGES.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`relative overflow-hidden rounded-xl cursor-pointer group ${
                  index === 0 ? 'col-span-2 row-span-2' : ''
                }`}
                onClick={() => openLightbox(index)}
              >
                <div className={`relative ${index === 0 ? 'h-[300px] md:h-[400px]' : 'h-[180px] md:h-[200px]'}`}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={index === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Overlay hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F37021" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                        <path d="M11 8v6" />
                        <path d="M8 11h6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Chiudi */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors p-2"
          >
            <X size={32} />
          </button>

          {/* Precedente */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 z-10 text-white/70 hover:text-white transition-colors p-2"
          >
            <ChevronLeft size={40} />
          </button>

          {/* Immagine */}
          <div
            className="relative w-full max-w-5xl max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={GALLERY_IMAGES[lightboxIndex].src}
              alt={GALLERY_IMAGES[lightboxIndex].alt}
              width={1920}
              height={1080}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              quality={90}
              priority
            />
            <p className="text-center text-white/60 text-sm mt-3">
              {GALLERY_IMAGES[lightboxIndex].alt} — {lightboxIndex + 1} / {GALLERY_IMAGES.length}
            </p>
          </div>

          {/* Successiva */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 z-10 text-white/70 hover:text-white transition-colors p-2"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </>
  );
}
