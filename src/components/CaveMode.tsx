import { useEffect, useRef } from 'react'

/* "Cave mode" Easter egg: dims the whole page and turns the pointer into a
   headlamp beam that reveals content in a circle of warm light. A nod to
   Gabe's caving + the Karst project. Pointer-events stay off so the page
   underneath is still fully usable. */
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
    // start the beam in the middle (esp. for touch, before first move)
    move(window.innerWidth / 2, window.innerHeight / 2)

    const onMouse = (e: MouseEvent) => move(e.clientX, e.clientY)
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0] || e.changedTouches[0]
      if (t) move(t.clientX, t.clientY)
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('touchstart', onTouch, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('touchstart', onTouch)
    }
  }, [active])

  return <div ref={ref} className={`cavemode ${active ? 'cavemode--on' : ''}`} aria-hidden />
}
