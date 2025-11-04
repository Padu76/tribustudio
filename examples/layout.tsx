import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/styles/cookieconsent-custom.css'
import CookieConsent from '@/components/CookieConsent'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tribù Studio - Personal Training Verona',
  description: 'Studio di Personal Training a Verona. Allenamenti personalizzati, nutrizione e massaggi.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className={inter.className}>
        {children}
        
        {/* Cookie Consent Banner - Sempre alla fine del body */}
        <CookieConsent />
      </body>
    </html>
  )
}
