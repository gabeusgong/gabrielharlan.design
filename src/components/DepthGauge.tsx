import { useEffect, useRef } from 'react'

const MAX_DEPTH = 120 // metres at the very bottom of the page
const H = 400 // svg viewBox height
const ZONES = [
  { at: 0, name: 'entrance' },
  { at: 0.28, name: 'twilight' },
  { at: 0.55, name: 'dark zone' },
  { at: 0.82, name: 'the deep' },
]

// jagged cave walls framing an irregular vertical passage (viewBox 44 x 400)
const LEFT_WALL =
  'M0,0 L18,0 L13,34 L20,70 L12,104 L19,140 L13,176 L21,212 L12,248 L18,286 L14,322 L19,360 L15,400 L0,400 Z'
const RIGHT_WALL =
  'M44,0 L27,0 L31,36 L24,72 L32,108 L25,146 L31,182 L24,220 L32,256 L26,292 L30,330 L25,366 L29,400 L44,400 Z'

/* A left-rail cave cross-section that fills as you scroll, like descending a
   passage — shows metres deep + the zone you're in. (Desktop only.) */
export default function DepthGauge() {
  const waterRef = useRef<SVGRectElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      const y = p * H
      if (waterRef.current) waterRef.current.setAttribute('height', String(y))
      if (dotRef.current) dotRef.current.setAttribute('cy', String(y))
      if (labelRef.current) {
        labelRef.current.style.top = `${(p * 100).toFixed(1)}%`
        const depth = Math.round(p * MAX_DEPTH)
        const zone = [...ZONES].reverse().find((z) => p >= z.at)?.name ?? 'entrance'
        labelRef.current.textContent = `${depth} m · ${zone}`
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="depthgauge" aria-hidden>
      <div className="depthgauge__cave">
        <svg
          className="depthgauge__svg"
          viewBox="0 0 44 400"
          preserveAspectRatio="none"
        >
          <rect ref={waterRef} className="depthgauge__water" x="0" y="0" width="44" height="0" />
          <path className="depthgauge__wall" d={LEFT_WALL} />
          <path className="depthgauge__wall" d={RIGHT_WALL} />
          <circle ref={dotRef} className="depthgauge__dot" cx="22" cy="0" r="4" />
        </svg>
        <span className="depthgauge__label" ref={labelRef}>
          0 m · entrance
        </span>
      </div>
    </div>
  )
}
