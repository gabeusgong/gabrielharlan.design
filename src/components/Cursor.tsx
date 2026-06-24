import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

/* A custom springy cursor "blob" that grows over interactive elements.
   Hidden on touch devices. */
export default function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 })

  const [active, setActive] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // only enable on devices with a fine pointer (mouse)
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const el = e.target as HTMLElement
      setActive(
        !!el.closest('a, button, [data-cursor], input, textarea'),
      )
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden
      className="cursor-blob"
      style={{ left: sx, top: sy }}
      animate={{ scale: active ? 2.4 : 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    />
  )
}
