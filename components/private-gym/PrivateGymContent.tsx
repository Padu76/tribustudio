// components/private-gym/PrivateGymContent.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import LiveSlots from "@/components/private-gym/LiveSlots";
import HeaderNav from "@/components/private-gym/HeaderNav";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const studioImages = [
  "/images/private-gym/studio/studio1.jpg",
  "/images/private-gym/studio/studio2.jpg",
  "/images/private-gym/studio/studio3.jpg",
];

const attrezzature = [
  "/images/private-gym/attrezzature/attrezzatura1.jpg",
  "/images/private-gym/attrezzature/attrezzatura2.jpg",
  "/images/private-gym/attrezzature/attrezzatura3.jpg",
  "/images/private-gym/attrezzature/attrezzatura4.jpg",
  "/images/private-gym/attrezzature/attrezzatura5.jpg",
];

function SectionTitle({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow ? (
        <div className="mb-4 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-400">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
      {text ? <p className="mt-4 text-base leading-7 text-white/80 sm:text-lg">{text}</p> : null}
    </div>
  );
}

export default function PrivateGymContent() {
  const { t } = useLanguage();

  const postazioni = [
    { title: t("pgPostazioni", "p1title"), image: "/images/private-gym/postazioni/postazione1.jpg", text: t("pgPostazioni", "p1text") },
    { title: t("pgPostazioni", "p2title"), image: "/images/private-gym/postazioni/postazione2.jpg", text: t("pgPostazioni", "p2text") },
    { title: t("pgPostazioni", "p3title"), image: "/images/private-gym/postazioni/postazione3.jpg", text: t("pgPostazioni", "p3text") },
  ];

  const steps = [
    { n: "01", t: t("pgComeFunziona", "step1t"), d: t("pgComeFunziona", "step1d") },
    { n: "02", t: t("pgComeFunziona", "step2t"), d: t("pgComeFunziona", "step2d") },
    { n: "03", t: t("pgComeFunziona", "step3t"), d: t("pgComeFunziona", "step3d") },
    { n: "04", t: t("pgComeFunziona", "step4t"), d: t("pgComeFunziona", "step4d") },
  ];

  const rules = [
    t("pgRegole", "r1"), t("pgRegole", "r2"), t("pgRegole", "r3"), t("pgRegole", "r4"),
    t("pgRegole", "r5"), t("pgRegole", "r6"), t("pgRegole", "r7"),
  ];

  const faqs = [
    { q: t("pgFaq", "q1"), a: t("pgFaq", "a1") },
    { q: t("pgFaq", "q2"), a: t("pgFaq", "a2") },
    { q: t("pgFaq", "q3"), a: t("pgFaq", "a3") },
    { q: t("pgFaq", "q4"), a: t("pgFaq", "a4") },
    { q: t("pgFaq", "q5"), a: t("pgFaq", "a5") },
    { q: t("pgFaq", "q6"), a: t("pgFaq", "a6") },
  ];

  return (
    <main className="bg-[#050505] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <Image src="/images/logo/logo-tribu-white.png" alt="Tribù Studio" width={140} height={50} className="h-10 w-auto" priority />
            </Link>
            <span className="text-xs text-white/40 hidden sm:inline">|</span>
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider hidden sm:inline">Private Gym</span>
          </div>

          <HeaderNav />

          <div className="flex items-center gap-3">
            <a href="#calendario" className="hidden sm:inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600">
              {t("pgNav", "prenotaOra")}
            </a>
            <Link href="/private-gym/tribu-admin" className="rounded-full p-2 text-white/20 transition hover:bg-white/10 hover:text-white/60" title="Admin">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/private-gym/studio/studio1.jpg" alt="Tribù Studio" fill priority sizes="100vw" className="object-cover" quality={75} />
          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_25%)]" />
        </div>
        <div className="relative mx-auto flex min-h-[86vh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-orange-400">
              {t("pgHero", "badge")}
            </div>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white sm:text-6xl">
              {t("pgHero", "title1")}<br />{t("pgHero", "title2")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75 sm:text-xl">{t("pgHero", "subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {[t("pgHero", "tag1"), t("pgHero", "tag2"), t("pgHero", "tag3"), t("pgHero", "tag4")].map((tag) => (
                <div key={tag} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85">{tag}</div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#calendario" className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">{t("pgHero", "ctaPrimary")}</a>
              <a href="#studio" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">{t("pgHero", "ctaSecondary")}</a>
            </div>
          </div>
        </div>
      </section>

      {/* IL PROGETTO */}
      <section id="progetto" className="scroll-mt-24 border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <SectionTitle eyebrow={t("pgProgetto", "eyebrow")} title={t("pgProgetto", "title")} text={t("pgProgetto", "text")} />
            <div className="space-y-5 text-white/75">
              <p>{t("pgProgetto", "p1")}</p>
              <p>{t("pgProgetto", "p2")}</p>
              <p>{t("pgProgetto", "p3")}</p>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">{t("pgProgetto", "perChiTitle")}</div>
            <div className="mt-6 space-y-4 text-white/80">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">{t("pgProgetto", "perChi1")}</div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">{t("pgProgetto", "perChi2")}</div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">{t("pgProgetto", "perChi3")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section id="come-funziona" className="scroll-mt-24 border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow={t("pgComeFunziona", "eyebrow")} title={t("pgComeFunziona", "title")} text={t("pgComeFunziona", "text")} />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((item) => (
              <div key={item.n} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                <div className="text-sm font-semibold tracking-[0.2em] text-orange-400">{item.n}</div>
                <h3 className="mt-4 text-xl font-semibold text-white">{item.t}</h3>
                <p className="mt-3 text-white/80">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LO STUDIO */}
      <section id="studio" className="scroll-mt-24 border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow={t("pgStudio", "eyebrow")} title={t("pgStudio", "title")} text={t("pgStudio", "text")} />
          <div className="grid gap-6 md:grid-cols-3">
            {studioImages.map((image, index) => (
              <div key={image} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
                <Image src={image} alt={`Studio Tribù ${index + 1}`} width={1200} height={800} className="h-[300px] w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POSTAZIONI */}
      <section id="postazioni" className="scroll-mt-24 border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow={t("pgPostazioni", "eyebrow")} title={t("pgPostazioni", "title")} text={t("pgPostazioni", "text")} />
          <div className="grid gap-6 lg:grid-cols-3">
            {postazioni.map((item) => (
              <div key={item.title} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
                <Image src={item.image} alt={item.title} width={1200} height={800} className="h-[260px] w-full object-cover" loading="lazy" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-white/80">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATTREZZATURE */}
      <section id="attrezzature" className="scroll-mt-24 border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow={t("pgAttrezzature", "eyebrow")} title={t("pgAttrezzature", "title")} text={t("pgAttrezzature", "text")} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {attrezzature.map((image, index) => (
              <div key={image} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
                <Image src={image} alt={`${t("pgAttrezzature", "eyebrow")} ${index + 1}`} width={1200} height={800} className="h-[250px] w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMFORT */}
      <section className="border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <SectionTitle eyebrow={t("pgComfort", "eyebrow")} title={t("pgComfort", "title")} text={t("pgComfort", "text")} />
          </div>
          <div className="space-y-6">
            {["/images/private-gym/spogliatoi/spogliatoio1.jpg", "/images/private-gym/spogliatoi/spogliatoio2.jpg"].map((src) => (
              <div key={src} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
                <Image src={src} alt="Spogliatoio" width={1200} height={800} className="h-[220px] w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="space-y-6">
            {["/images/private-gym/attesa/attesa.jpg", "/images/private-gym/esterno/esterno.jpg"].map((src, i) => (
              <div key={src} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
                <Image src={src} alt={i === 0 ? "Sala attesa" : "Esterno studio"} width={1200} height={800} className="h-[220px] w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAMBIO SLOT */}
      <section className="border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 max-w-3xl mx-auto">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">{t("pgCambio", "label")}</div>
            <h3 className="mt-4 text-2xl font-bold text-white">{t("pgCambio", "title")}</h3>
            <p className="mt-4 text-white/80">{t("pgCambio", "p1")}</p>
            <p className="mt-4 text-white/80">{t("pgCambio", "p2")}</p>
          </div>
        </div>
      </section>

      {/* CALENDARIO */}
      <section id="calendario" className="scroll-mt-24 border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow={t("pgCalendario", "eyebrow")} title={t("pgCalendario", "title")} text={t("pgCalendario", "text")} />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold">{t("pgCalendario", "slotTitle")}</h3>
                <p className="mt-1 text-sm text-white/55">{t("pgCalendario", "slotSubtitle")}</p>
              </div>
              <LiveSlots />
            </div>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">{t("pgCalendario", "flussoLabel")}</div>
              <div className="mt-6 space-y-4">
                {[t("pgCalendario", "flusso1"), t("pgCalendario", "flusso2"), t("pgCalendario", "flusso3"), t("pgCalendario", "flusso4")].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 font-semibold text-white flex-shrink-0">{index + 1}</div>
                    <div className="pt-1 text-white/80">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COSTI */}
      <section id="costi" className="scroll-mt-24 border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-400">{t("pgCosti", "label")}</div>
            <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">{t("pgCosti", "title")}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-white/75">{t("pgCosti", "text")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Standard */}
            <div className="rounded-[36px] border border-white/10 bg-white/5 p-8 text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{t("pgCosti", "standardLabel")}</div>
              <div className="mt-4 text-5xl font-bold text-white">25€</div>
              <div className="text-white/50 mt-1">/ ora</div>
              <p className="mt-5 text-sm text-white/60">{t("pgCosti", "standardDesc")}</p>
              <div className="mt-6 space-y-3">
                {[t("pgCosti", "feat1"), t("pgCosti", "feat2"), t("pgCosti", "feat3"), t("pgCosti", "feat4")].map((tag) => (
                  <div key={tag} className="flex items-center gap-2 text-sm text-white/70">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/40 flex-shrink-0"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {tag}
                  </div>
                ))}
              </div>
              <a href="#calendario" className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">{t("pgCosti", "standardCta")}</a>
            </div>
            {/* Cliente Tribù */}
            <div className="relative rounded-[36px] border-2 border-orange-500/40 bg-gradient-to-br from-orange-500/10 to-white/5 p-8 text-center">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">{t("pgCosti", "tribuBadge")}</div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">{t("pgCosti", "tribuLabel")}</div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-2xl text-white/30 line-through">25€</span>
                <span className="text-5xl font-bold text-orange-400">20€</span>
              </div>
              <div className="text-orange-400/60 mt-1">/ ora</div>
              <p className="mt-5 text-sm text-white/60">{t("pgCosti", "tribuDesc")}</p>
              <div className="mt-6 space-y-3">
                {[t("pgCosti", "tribuFeat1"), t("pgCosti", "tribuFeat2"), t("pgCosti", "tribuFeat3"), t("pgCosti", "tribuFeat4")].map((tag) => (
                  <div key={tag} className="flex items-center gap-2 text-sm text-white/70">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-orange-400 flex-shrink-0"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {tag}
                  </div>
                ))}
              </div>
              <a href="#calendario" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">{t("pgCosti", "tribuCta")}</a>
            </div>
          </div>
        </div>
      </section>

      {/* REGOLE */}
      <section id="regole" className="scroll-mt-24 border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <SectionTitle eyebrow={t("pgRegole", "eyebrow")} title={t("pgRegole", "title")} text={t("pgRegole", "text")} />
          </div>
          <div className="grid gap-4">
            {rules.map((rule) => (
              <div key={rule} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/80">{rule}</div>
            ))}
          </div>
        </div>
      </section>

      {/* SICUREZZA + PENALI */}
      <section className="border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">{t("pgSicurezza", "sicurezzaLabel")}</div>
            <h3 className="mt-4 text-2xl font-bold text-white">{t("pgSicurezza", "sicurezzaTitle")}</h3>
            <p className="mt-4 text-white/80">{t("pgSicurezza", "sicurezzaText")}</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">{t("pgSicurezza", "penaliLabel")}</div>
            <h3 className="mt-4 text-2xl font-bold text-white">{t("pgSicurezza", "penaliTitle")}</h3>
            <p className="mt-4 text-white/80">{t("pgSicurezza", "penaliText")}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow={t("pgFaq", "eyebrow")} title={t("pgFaq", "title")} text={t("pgFaq", "text")} />
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="rounded-[24px] border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold text-white">{item.q}</h3>
                <p className="mt-3 text-white/80">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINALE */}
      <section className="border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-[36px] border border-white/10 bg-white/5 p-8 sm:p-12">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">{t("pgCta", "label")}</div>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">{t("pgCta", "title")}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-white/75">{t("pgCta", "text")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a href="#calendario" className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">{t("pgCta", "primary")}</a>
              <Link href="/" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">{t("pgCta", "secondary")}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp */}
      <a href="https://wa.me/393478881515?text=Ciao%2C%20vorrei%20info%20sul%20servizio%20Private%20Gym%20%F0%9F%92%AA" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/30 transition hover:scale-105 hover:bg-[#1fb855]">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        {t("pgWhatsapp", "cta")}
      </a>
    </main>
  );
}
