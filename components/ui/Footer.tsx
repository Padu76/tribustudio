// components/ui/Footer.tsx
import { Instagram, Facebook, MapPin, Phone, Mail, Dumbbell, Heart, Activity } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const CONTACT_INFO = {
  phone: '3478881515',
  phoneDisplay: '347 888 1515',
  email: 'info@tribustudio.it',
  address: 'Via Albere 27/B – Verona',
};

const LEGAL_INFO = {
  name: 'Andrea Padoan',
  cf: 'PDNNDR76D16L781P',
  piva: '04058990237',
  pec: 'andreapadoan@pec.it',
};

const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/tribu_personal_trainer/',
  facebook: 'https://www.facebook.com/tribupersonaltrainingstudio/?locale=it_IT'
};

// Link rapidi aggiornati con la nuova struttura
const FOOTER_LINKS = [
  { label: 'Chi siamo', href: '#chi-siamo' },
  { label: 'Galleria', href: '#galleria' },
  { label: 'Come funziona', href: '#come-funziona' },
  { label: 'Testimonianze', href: '#testimonianze' },
  { label: 'FAQ', href: '#faq' },
];

const FOOTER_PAGES = [
  { label: 'Servizi Fitness', href: '/servizi-fitness', icon: Activity },
  { label: 'Servizi Benessere', href: '/servizi-benessere', icon: Heart },
  { label: 'Private Gym', href: '/private-gym', icon: Dumbbell },
  { label: 'Blog', href: '/blog' },
  { label: 'Quiz Percorso', href: '/quiz' },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="container-custom mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e descrizione */}
          <div>
            <Image
              src="/images/logo/logo-tribu-white.png"
              alt="Tribù Personal Training Studio"
              width={150}
              height={50}
              className="h-12 w-auto mb-4"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Il tuo studio di Personal Training a Verona dove ogni allenamento è su misura.
            </p>
          </div>

          {/* Link rapidi */}
          <div>
            <h4 className="font-montserrat font-semibold mb-4 text-sm uppercase tracking-wider text-white/90">Link Rapidi</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Pagine e servizi */}
          <div>
            <h4 className="font-montserrat font-semibold mb-4 text-sm uppercase tracking-wider text-white/90">Servizi</h4>
            <ul className="space-y-2">
              {FOOTER_PAGES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-1.5"
                  >
                    {item.icon && <item.icon size={14} />}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contatti */}
            <h4 className="font-montserrat font-semibold mb-3 mt-6 text-sm uppercase tracking-wider text-white/90">Contatti</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin size={14} className="text-primary flex-shrink-0" />
                {CONTACT_INFO.address}
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone size={14} className="text-primary flex-shrink-0" />
                {CONTACT_INFO.phoneDisplay}
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={14} className="text-primary flex-shrink-0" />
                {CONTACT_INFO.email}
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-montserrat font-semibold mb-4 text-sm uppercase tracking-wider text-white/90">Seguici</h4>
            <div className="flex gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-purple-600 to-pink-500 p-3 rounded-full hover:scale-110 transition-transform shadow-lg"
                aria-label="Instagram"
              >
                <Instagram size={20} className="text-white" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 p-3 rounded-full hover:scale-110 transition-transform shadow-lg"
                aria-label="Facebook"
              >
                <Facebook size={20} className="text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar con dati legali */}
        <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Tribù Personal Training Studio. Tutti i diritti riservati.</p>
          <p className="mt-2">
            {LEGAL_INFO.name} — C.F. {LEGAL_INFO.cf} — P.IVA {LEGAL_INFO.piva}
          </p>
          <p className="mt-1">
            PEC: <a href={`mailto:${LEGAL_INFO.pec}`} className="hover:text-primary transition-colors">{LEGAL_INFO.pec}</a>
          </p>
          <p className="mt-3">
            <a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a>
            {' · '}
            <a href="/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
