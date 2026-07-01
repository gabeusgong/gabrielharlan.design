import { useEffect, type RefObject } from 'react'

const SEL =
  'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'

/* Traps keyboard focus inside `ref` while `active`, and restores focus to the
   previously-focused element when it closes. */
export function useFocusTrap(active: boolean, ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return
    const el = ref.current
    if (!el) return
    const prev = document.activeElement as HTMLElement | null

    const items = () =>
      Array.from(el.querySelectorAll<HTMLElement>(SEL)).filter(
        (n) => n.offsetWidth > 0 || n.offsetHeight > 0 || n === document.activeElement,
      )

    // move focus in (unless something inside already has it)
    if (!el.contains(document.activeElement)) {
      const f = items()
      ;(f[0] ?? el).focus?.()
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const f = items()
      if (!f.length) {
        e.preventDefault()
        return
      }
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    el.addEventListener('keydown', onKey)
    return () => {
      el.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [active, ref])
}
