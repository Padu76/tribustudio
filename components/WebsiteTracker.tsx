'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface WebsiteTrackerProps {
  websiteId: string
  apiEndpoint?: string
}

function TrackerContent({ websiteId, apiEndpoint }: WebsiteTrackerProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Funzione per ottenere/creare session ID
    function getSessionId(): string {
      let sessionId = sessionStorage.getItem('tribu_session_id')
      if (!sessionId) {
        sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        sessionStorage.setItem('tribu_session_id', sessionId)
      }
      return sessionId
    }

    // Funzione per estrarre parametri UTM
    function getUtmParams() {
      return {
        utm_source: searchParams.get('utm_source'),
        utm_medium: searchParams.get('utm_medium'),
        utm_campaign: searchParams.get('utm_campaign')
      }
    }

    // Traccia la visita
    async function trackPageView() {
      const utm = getUtmParams()
      const pageUrl = pathname + (searchParams.toString() ? '?' + searchParams.toString() : '')
      
      const data = {
        website: websiteId,
        page_url: pageUrl,
        page_title: document.title,
        referrer: document.referrer || null,
        session_id: getSessionId(),
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign
      }

      try {
        await fetch(apiEndpoint || 'https://tribu-crm-hub.vercel.app/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
      } catch (error) {
        // Silently fail - non vogliamo bloccare il sito se il tracking fallisce
        console.error('Tracking error:', error)
      }
    }

    // Esegui tracking
    trackPageView()
  }, [pathname, searchParams, websiteId, apiEndpoint])

  return null
}

export default function WebsiteTracker(props: WebsiteTrackerProps) {
  return (
    <Suspense fallback={null}>
      <TrackerContent {...props} />
    </Suspense>
  )
}