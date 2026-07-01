import { useEffect, useRef } from 'react'

/* "Cave mode" Easter egg: recolors the whole site into a black/amber
   underground theme and casts a warm headlamp glow that follows the
   pointer (or finger). Scrolling stays fully enabled. Exit via the nav
   lamp or the Escape key. */
export default function CaveMode({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active) return
    const el = ref.current
    if (!el) return

    const move = (x: number, y: number) => {
      el.style.setProperty('--mx', `${x}px`)
      el.style.setProperty('--my', `${y}px`)
    }
    move(window.innerWidth / 2, window.innerHeight * 0.4)

    const onMouse = (e: MouseEvent) => move(e.clientX, e.clientY)
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) move(t.clientX, t.clientY)
    }

    // passive listeners — the beam follows the finger but never blocks scrolling
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchstart', onTouch, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })

    // recolor the whole site into the underground (black/amber) theme
    document.documentElement.classList.add('cave-active')

    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('touchmove', onTouch)
      document.documentElement.classList.remove('cave-active')
    }
  }, [active])

  return (
    <div ref={ref} className={`cavemode ${active ? 'cavemode--on' : ''}`} aria-hidden>
      {/* a bat that trails the headlamp beam */}
      <span className="cavemode__bat">🦇</span>
    </div>
  )
}
