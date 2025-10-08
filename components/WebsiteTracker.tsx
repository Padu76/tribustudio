'use client'

import { useEffect, useRef, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface WebsiteTrackerProps {
  websiteId: string
  apiEndpoint?: string
}

function TrackerContent({ websiteId, apiEndpoint }: WebsiteTrackerProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const startTimeRef = useRef<number>(Date.now())
  const maxScrollDepthRef = useRef<number>(0)
  const clicksCountRef = useRef<number>(0)
  const dataSentRef = useRef<boolean>(false)

  useEffect(() => {
    // Reset per nuova pagina
    startTimeRef.current = Date.now()
    maxScrollDepthRef.current = 0
    clicksCountRef.current = 0
    dataSentRef.current = false

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

    // Calcola scroll depth
    function getScrollDepth(): number {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100
      return Math.min(100, Math.max(0, Math.round(scrollPercentage)))
    }

    // Traccia scroll
    function handleScroll() {
      const currentScroll = getScrollDepth()
      if (currentScroll > maxScrollDepthRef.current) {
        maxScrollDepthRef.current = currentScroll
      }
    }

    // Traccia click
    function handleClick() {
      clicksCountRef.current++
    }

    // Invia dati di tracking
    async function sendTrackingData(isExitPage: boolean = false) {
      if (dataSentRef.current) return
      dataSentRef.current = true

      const utm = getUtmParams()
      const pageUrl = pathname + (searchParams.toString() ? '?' + searchParams.toString() : '')
      const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000)
      
      const data = {
        website: websiteId,
        page_url: pageUrl,
        page_title: document.title,
        referrer: document.referrer || null,
        session_id: getSessionId(),
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
        time_on_page: timeOnPage,
        scroll_depth: maxScrollDepthRef.current,
        clicks_count: clicksCountRef.current,
        exit_page: isExitPage,
        bounce: timeOnPage < 5 && clicksCountRef.current === 0,
        window_width: window.innerWidth,
        window_height: window.innerHeight
      }

      try {
        await fetch(apiEndpoint || 'https://tribu-crm-hub.vercel.app/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          keepalive: true // Importante per beforeunload
        })
      } catch (error) {
        console.error('Tracking error:', error)
      }
    }

    // Handler per quando l'utente lascia la pagina
    function handleBeforeUnload() {
      sendTrackingData(true)
    }

    // Handler per visibilità pagina
    function handleVisibilityChange() {
      if (document.hidden) {
        sendTrackingData(true)
      }
    }

    // Aggiungi event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('click', handleClick, true)
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Invia tracking iniziale dopo 5 secondi (per catturare bounce)
    const initialTimeout = setTimeout(() => {
      sendTrackingData(false)
    }, 5000)

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClick)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearTimeout(initialTimeout)
      
      // Invia dati finali se non già fatto
      if (!dataSentRef.current) {
        sendTrackingData(true)
      }
    }
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
