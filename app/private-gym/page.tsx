// app/private-gym/page.tsx
import Image from "next/image";
import Link from "next/link";
import LiveSlots from "@/components/private-gym/LiveSlots";

const studioImages = [
  "/images/private-gym/studio/studio1.jpg",
  "/images/private-gym/studio/studio2.jpg",
  "/images/private-gym/studio/studio3.jpg",
];

const postazioni = [
  {
    title: "Postazione 1",
    image: "/images/private-gym/postazioni/postazione1.jpg",
    text: "Area principale per lavoro di forza e utilizzo delle attrezzature principali.",
  },
  {
    title: "Postazione 2",
    image: "/images/private-gym/postazioni/postazione2.jpg",
    text: "Spazio dedicato a lavoro complementare, mobilità e circuiti funzionali.",
  },
  {
    title: "Postazione 3",
    image: "/images/private-gym/postazioni/postazione3.jpg",
    text: "Area ideale per attivazione, riscaldamento e lavoro a corpo libero.",
  },
];

const attrezzature = [
  "/images/private-gym/attrezzature/attrezzatura1.jpg",
  "/images/private-gym/attrezzature/attrezzatura2.jpg",
  "/images/private-gym/attrezzature/attrezzatura3.jpg",
  "/images/private-gym/attrezzature/attrezzatura4.jpg",
  "/images/private-gym/attrezzature/attrezzatura5.jpg",
];

const faqs = [
  {
    q: "Quanto costa prenotare lo studio?",
    a: "Il costo è di 25€ per uno slot da 1 ora.",
  },
  {
    q: "Quando posso entrare?",
    a: "Puoi accedere 10 minuti prima dell'inizio dello slot tramite smartphone.",
  },
  {
    q: "Devo uscire prima della fine?",
    a: "Devi terminare l'utilizzo delle attrezzature 5 minuti prima della fine dello slot per riordinare tutto correttamente.",
  },
  {
    q: "Come apro la porta?",
    a: "Dopo la prenotazione riceverai l'accesso smart direttamente sul tuo smartphone.",
  },
  {
    q: "Posso portare un'altra persona?",
    a: "No, l'accesso è consentito esclusivamente alla persona che ha effettuato la prenotazione.",
  },
  {
    q: "Lo studio è videosorvegliato?",
    a: "Sì, l'area è videosorvegliata per sicurezza, controllo accessi e tutela della struttura.",
  },
];

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow ? (
        <div className="mb-4 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-400">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {text ? <p className="mt-4 text-base leading-7 text-white/80 sm:text-lg">{text}</p> : null}
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-sm font-medium text-white/75 transition hover:text-white"
    >
      {children}
    </a>
  );
}

export default function TribuPrivateGymPage() {
  return (
    <main className="bg-[#050505] text-white">
      {/* Header Private Gym */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo/logo-tribu-white.png"
                alt="Tribù Studio"
                width={140}
                height={50}
                className="h-10 w-auto"
                priority
              />
            </Link>
            <span className="text-xs text-white/40 hidden sm:inline">|</span>
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider hidden sm:inline">Private Gym</span>
          </div>

          <nav className="hidden items-center gap-6 lg:flex">
            <NavLink href="#progetto">Il progetto</NavLink>
            <NavLink href="#come-funziona">Come funziona</NavLink>
            <NavLink href="#studio">Lo studio</NavLink>
            <NavLink href="#postazioni">Postazioni</NavLink>
            <NavLink href="#attrezzature">Attrezzature</NavLink>
            <NavLink href="#calendario">Calendario</NavLink>
            <NavLink href="#costi">Costi</NavLink>
            <NavLink href="#regole">Regole</NavLink>
            <NavLink href="#faq">FAQ</NavLink>
            <Link href="/" className="text-sm text-white/50 hover:text-white transition">
              ← Tribù Studio
            </Link>
          </nav>

          <a
            href="#calendario"
            className="inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Prenota ora
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/private-gym/studio/studio1.jpg"
            alt="Tribù Studio"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            quality={75}
          />
          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_25%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[86vh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-orange-400">
              Prenotazione studio autogestito
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">
              Prenota lo studio.
              <br />
              Allenati in autonomia.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75 sm:text-xl">
              Uno spazio professionale con 3 postazioni di lavoro, accesso smart tramite smartphone,
              pagamento online e slot orari prenotabili per allenarti in autonomia.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {['25€ / ora', 'Accesso 10 minuti prima', '3 postazioni', 'Accesso smart'].map((tag) => (
                <div key={tag} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85">
                  {tag}
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#calendario"
                className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Controlla gli slot disponibili
              </a>
              <a
                href="#studio"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Guarda lo studio
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* IL PROGETTO */}
      <section id="progetto" className="scroll-mt-24 border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <SectionTitle
              eyebrow="Il progetto"
              title="Cos'è Tribù Private Gym"
              text="Tribù Private Gym è il servizio che ti permette di prenotare uno slot orario all'interno dello studio Tribù e allenarti in autonomia in uno spazio professionale, ordinato e riservato."
            />
            <div className="space-y-5 text-white/75">
              <p>
                Non è una palestra aperta al pubblico e non è un semplice affitto di sala. È uno studio
                organizzato per offrire un&apos;esperienza più pulita, più privata e più efficiente.
              </p>
              <p>
                L&apos;obiettivo è ottimizzare l&apos;utilizzo dello spazio e permettere a clienti selezionati di
                allenarsi in autonomia, con accesso smart e regole chiare.
              </p>
              <p>
                È il primo test operativo di un nuovo servizio Tribù: semplice nel flusso, ma serio
                nell&apos;organizzazione.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
              Per chi è pensato
            </div>
            <div className="mt-6 space-y-4 text-white/80">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                Per chi vuole allenarsi in un ambiente ordinato e non affollato.
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                Per chi vuole uno spazio professionale senza i tempi morti di una palestra classica.
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                Per chi vuole prenotare, entrare e allenarsi in autonomia.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section id="come-funziona" className="scroll-mt-24 border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Come funziona"
            title="Un flusso semplice, chiaro e veloce"
            text="L'obiettivo è togliere attrito: scegli lo slot, paghi, ricevi l'accesso e ti alleni."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              { n: "01", t: "Scegli lo slot", d: "Guarda gli orari disponibili e seleziona quello che preferisci." },
              { n: "02", t: "Paga online", d: "La prenotazione viene confermata solo dopo il pagamento." },
              { n: "03", t: "Ricevi l'accesso", d: "Ti arriva l'accesso smart per entrare nello studio tramite smartphone." },
              { n: "04", t: "Entra e allenati", d: "Accedi 10 minuti prima e utilizza lo studio in autonomia." },
            ].map((item) => (
              <div key={item.n} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                <div className="text-sm font-semibold tracking-[0.2em] text-orange-400">{item.n}</div>
                <h3 className="mt-4 text-xl font-semibold">{item.t}</h3>
                <p className="mt-3 text-white/80">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LO STUDIO */}
      <section id="studio" className="scroll-mt-24 border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Lo studio"
            title="Uno studio vero, non una sala improvvisata"
            text="Uno spazio progettato per allenamenti individuali fluidi e ordinati, con attrezzatura selezionata e organizzazione per postazioni."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {studioImages.map((image, index) => (
              <div key={image} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
                <Image
                  src={image}
                  alt={`Studio Tribù ${index + 1}`}
                  width={1200}
                  height={800}
                  className="h-[300px] w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POSTAZIONI */}
      <section id="postazioni" className="scroll-mt-24 border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Postazioni"
            title="3 postazioni di lavoro"
            text="Lo studio è organizzato per permettere un utilizzo ordinato dello spazio anche nel cambio tra uno slot e il successivo."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {postazioni.map((item) => (
              <div key={item.title} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={1200}
                  height={800}
                  className="h-[260px] w-full object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
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
          <SectionTitle
            eyebrow="Attrezzature"
            title="Attrezzature disponibili"
            text="Lo studio è equipaggiato per consentire allenamenti individuali completi, con strumenti adatti a forza, mobilità, attivazione e lavoro funzionale."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {attrezzature.map((image, index) => (
              <div key={image} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
                <Image
                  src={image}
                  alt={`Attrezzatura ${index + 1}`}
                  width={1200}
                  height={800}
                  className="h-[250px] w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMFORT */}
      <section className="border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <SectionTitle
              eyebrow="Comfort"
              title="Spogliatoi, attesa ed esterno"
              text="Anche questi dettagli contano: aiutano a rendere l'esperienza più ordinata, chiara e professionale."
            />
          </div>
          <div className="space-y-6">
            {['/images/private-gym/spogliatoi/spogliatoio1.jpg', '/images/private-gym/spogliatoi/spogliatoio2.jpg'].map((src) => (
              <div key={src} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
                <Image src={src} alt="Spogliatoio" width={1200} height={800} className="h-[220px] w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="space-y-6">
            {['/images/private-gym/attesa/attesa.jpg', '/images/private-gym/esterno/esterno.jpg'].map((src, i) => (
              <div key={src} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
                <Image src={src} alt={i === 0 ? 'Sala attesa' : 'Esterno studio'} width={1200} height={800} className="h-[220px] w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAMBIO SLOT */}
      <section className="border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 max-w-3xl mx-auto">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">Cambio slot</div>
            <h3 className="mt-4 text-2xl font-bold text-white">Come funziona il cambio tra utenti</h3>
            <p className="mt-4 text-white/80">
              L&apos;utente che termina lo slot deve concludere l&apos;utilizzo delle attrezzature 5 minuti
              prima della fine, così da riordinare la postazione e lasciarla pronta.
            </p>
            <p className="mt-4 text-white/80">
              L&apos;utente successivo può accedere 10 minuti prima e attendere nella sala di attesa o
              iniziare il riscaldamento. In questo modo il flusso rimane ordinato senza tempi morti.
            </p>
          </div>
        </div>
      </section>

      {/* CALENDARIO */}
      <section id="calendario" className="scroll-mt-24 border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Calendario"
            title="Controlla gli slot disponibili"
            text="Seleziona il giorno, l'orario disponibile e procedi con la prenotazione."
          />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold">Slot disponibili</h3>
                <p className="mt-1 text-sm text-white/55">Seleziona uno slot e prenota la tua sessione</p>
              </div>
              <LiveSlots />
            </div>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
                Flusso prenotazione
              </div>
              <div className="mt-6 space-y-4">
                {[
                  "Seleziona uno slot disponibile",
                  "Conferma la prenotazione",
                  "Completa il pagamento online",
                  "Ricevi l'accesso smart sul telefono",
                ].map((item, index) => (
                  <div key={item} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 font-semibold text-white flex-shrink-0">
                      {index + 1}
                    </div>
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
          <div className="rounded-[36px] border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-white/5 p-8 text-center sm:p-12">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-400">Costi</div>
            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">25€ / ora</h2>
            <p className="mx-auto mt-5 max-w-2xl text-white/75">
              Accesso allo studio, utilizzo delle attrezzature disponibili, ingresso 10 minuti prima
              e gestione smart della prenotazione.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {['Accesso smart', '3 postazioni', 'Attrezzature incluse', 'Ingresso anticipato'].map((tag) => (
                <div key={tag} className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/85">
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REGOLE */}
      <section id="regole" className="scroll-mt-24 border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <SectionTitle
              eyebrow="Regole"
              title="Regole di utilizzo"
              text="Questa parte è fondamentale: il servizio funziona bene solo se l'utilizzo dello studio rimane ordinato, rispettoso e coerente con le regole."
            />
          </div>
          <div className="grid gap-4">
            {[
              "Accesso consentito esclusivamente all'utente che ha effettuato la prenotazione.",
              "Ingresso solo nell'orario prenotato, con accesso disponibile 10 minuti prima.",
              "Scarpe pulite oppure allenamento con calze.",
              "Asciugamano personale obbligatorio.",
              "Attrezzature da utilizzare con cura e da rimettere al proprio posto.",
              "Utilizzo delle attrezzature da terminare 5 minuti prima della fine dello slot.",
              "Postazione da lasciare ordinata e pronta per l'utente successivo.",
            ].map((rule) => (
              <div key={rule} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/80">
                {rule}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SICUREZZA + PENALI */}
      <section className="border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">Sicurezza</div>
            <h3 className="mt-4 text-2xl font-bold">Videosorveglianza e tutela dello studio</h3>
            <p className="mt-4 text-white/80">
              L&apos;area è videosorvegliata per sicurezza, controllo accessi e tutela della struttura.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-8">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">Penali</div>
            <h3 className="mt-4 text-2xl font-bold">Mancato rispetto delle regole</h3>
            <p className="mt-4 text-white/80">
              Il mancato rispetto del regolamento può comportare sospensione del servizio, penali
              economiche o esclusione da future prenotazioni.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="FAQ"
            title="Domande frequenti"
            text="Le risposte base che devi avere prima di prenotare."
          />
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="rounded-[24px] border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold">{item.q}</h3>
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
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">Prenotazione</div>
            <h2 className="mt-4 text-3xl font-bold sm:text-5xl">Prenota il tuo slot</h2>
            <p className="mx-auto mt-5 max-w-2xl text-white/75">
              Allenati in autonomia in uno spazio professionale, ordinato e riservato.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="#calendario"
                className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Vai al calendario
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                ← Tribù Studio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp floating */}
      <a
        href="https://wa.me/393478881515?text=Ciao%2C%20vorrei%20info%20sul%20servizio%20Private%20Gym%20%F0%9F%92%AA"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/30 transition hover:scale-105 hover:bg-[#1fb855]"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Chiedi info
      </a>
    </main>
  );
}
