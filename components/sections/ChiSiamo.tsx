// components/sections/ChiSiamo.tsx
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Target, Heart, Users, Sparkles, Award, Clock, Shield, Zap } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export default function ChiSiamo() {
  const { t } = useLanguage();
  const { ref: ref1, inView: inView1 } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: ref2, inView: inView2 } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: ref3, inView: inView3 } = useInView({ threshold: 0.1, triggerOnce: true });

  const values = [
    {
      icon: Target,
      title: t("chiSiamo", "value1Title"),
      description: t("chiSiamo", "value1Desc")
    },
    {
      icon: Heart,
      title: t("chiSiamo", "value2Title"),
      description: t("chiSiamo", "value2Desc")
    },
    {
      icon: Users,
      title: t("chiSiamo", "value3Title"),
      description: t("chiSiamo", "value3Desc")
    },
    {
      icon: Sparkles,
      title: t("chiSiamo", "value4Title"),
      description: t("chiSiamo", "value4Desc")
    }
  ];

  const features = [
    {
      icon: Award,
      title: t("chiSiamo", "feature1Title"),
      description: t("chiSiamo", "feature1Desc")
    },
    {
      icon: Clock,
      title: t("chiSiamo", "feature2Title"),
      description: t("chiSiamo", "feature2Desc")
    },
    {
      icon: Shield,
      title: t("chiSiamo", "feature3Title"),
      description: t("chiSiamo", "feature3Desc")
    },
    {
      icon: Zap,
      title: t("chiSiamo", "feature4Title"),
      description: t("chiSiamo", "feature4Desc")
    }
  ];

  return (
    <>
      {/* Sezione 1 - Intro con testo grande */}
      <section id="chi-siamo" className="py-20 md:py-32 relative overflow-hidden bg-white" ref={ref1}>
        <div className="container-custom mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView1 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">{t("chiSiamo", "eyebrow")}</span>
            <h2 className="text-4xl md:text-6xl font-montserrat font-bold mt-4 mb-8">
              {(() => {
                const full = t("chiSiamo", "title");
                const highlight = t("chiSiamo", "titleHighlight");
                const idx = full.indexOf(highlight);
                if (idx === -1) return full;
                return (
                  <>
                    {full.slice(0, idx)}
                    <span className="text-primary">{highlight}</span>
                    {full.slice(idx + highlight.length)}
                  </>
                );
              })()}
            </h2>
            <p className="text-xl md:text-2xl text-gray leading-relaxed mb-8">
              {t("chiSiamo", "text1")}
            </p>
            <p className="text-lg md:text-xl text-gray/80">
              {t("chiSiamo", "text2")}
            </p>
          </motion.div>

          {/* Valori con icone */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView1 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="bg-gradient-to-br from-primary to-primary-dark rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                      <Icon size={36} className="text-white" />
                    </div>
                    <h3 className="font-montserrat font-bold text-lg mb-2">{value.title}</h3>
                    <p className="text-gray text-sm">{value.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sezione 2 - Immagine parallax con next/image ottimizzato */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center" ref={ref2}>
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/studio/studio-1.jpg"
            alt="Interno dello studio Tribu"
            fill
            sizes="100vw"
            className="object-cover"
            quality={75}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>

        <div className="relative z-10 container-custom mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView2 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl md:text-5xl font-montserrat font-bold text-white mb-6">
              {t("chiSiamo", "parallaxTitle")}
            </h2>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              {t("chiSiamo", "parallaxText")}
            </p>
            <button
              onClick={() => document.getElementById('servizi')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-dark transition-all hover:scale-105"
            >
              {t("chiSiamo", "parallaxCta")}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Sezione 3 - Features con background colorato */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 to-white" ref={ref3}>
        <div className="container-custom mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView3 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4">
              {t("chiSiamo", "featuresTitle")}
            </h2>
            <p className="text-lg text-gray max-w-2xl mx-auto">
              {t("chiSiamo", "featuresSubtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView3 ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex gap-6 p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon size={28} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-montserrat font-bold text-xl mb-2">{feature.title}</h3>
                      <p className="text-gray">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
