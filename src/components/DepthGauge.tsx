import { useEffect, useRef } from 'react'

const MAX_DEPTH = 120 // metres at the very bottom of the page
const ZONES = [
  { at: 0, name: 'entrance' },
  { at: 0.28, name: 'twilight' },
  { at: 0.55, name: 'dark zone' },
  { at: 0.82, name: 'the deep' },
]

/* A slim left-rail "depth gauge" that fills as you scroll, like descending a
   cave — shows metres deep + the cave zone you're in. (Desktop only.) */
export default function DepthGauge() {
  const fillRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // cache the reflow-triggering scrollHeight; recompute only on resize
    let max = document.documentElement.scrollHeight - window.innerHeight
    let ticking = false
    const update = () => {
      ticking = false
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      const pct = `${(p * 100).toFixed(1)}%`
      if (fillRef.current) fillRef.current.style.height = pct
      if (markerRef.current) markerRef.current.style.top = pct
      const depth = Math.round(p * MAX_DEPTH)
      const zone = [...ZONES].reverse().find((z) => p >= z.at)?.name ?? 'entrance'
      if (labelRef.current) labelRef.current.textContent = `${depth} m · ${zone}`
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    const onResize = () => {
      max = document.documentElement.scrollHeight - window.innerHeight
      update()
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="depthgauge" aria-hidden>
      <div className="depthgauge__track">
        <div className="depthgauge__fill" ref={fillRef} />
        <div className="depthgauge__marker" ref={markerRef}>
          <span className="depthgauge__label" ref={labelRef}>0 m · entrance</span>
        </div>
      </div>
    </div>
  )
}
