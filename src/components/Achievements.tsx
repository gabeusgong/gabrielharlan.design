import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { SECRETS, getUnlocked, unlock, type Secret } from '../lib/achievements'

const KONAMI = [
  'arrowup', 'arrowup', 'arrowdown', 'arrowdown',
  'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a',
]

// Konami needs a keyboard, so drop it on touch devices — it isn't attainable
// there and shouldn't sit in the count as an impossible secret.
const isCoarse =
  typeof window !== 'undefined' && !!window.matchMedia?.('(pointer: coarse)').matches
const VISIBLE_SECRETS = isCoarse ? SECRETS.filter((s) => s.id !== 'konami') : SECRETS

/* Tracks hidden "secrets" the visitor discovers (cave mode, ring win, the bat,
   flinging a card, the Konami code) and shows a count + unlock toasts. */
export default function Achievements() {
  const [unlocked, setUnlocked] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<Secret | null>(null)

  useEffect(() => {
    setUnlocked(getUnlocked())

    const onUnlock = (e: Event) => {
      setUnlocked(getUnlocked())
      const s = (e as CustomEvent).detail as Secret | undefined
      if (s) {
        setToast(s)
        window.setTimeout(() => setToast(null), 2600)
      }
    }
    window.addEventListener('secret-unlocked', onUnlock)

    let seq: string[] = []
    const onKey = (e: KeyboardEvent) => {
      seq = [...seq, e.key.toLowerCase()].slice(-KONAMI.length)
      if (KONAMI.every((k, i) => k === seq[i])) unlock('konami')
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('secret-unlocked', onUnlock)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const total = VISIBLE_SECRETS.length
  const count = unlocked.filter((id) => VISIBLE_SECRETS.some((s) => s.id === id)).length

  return (
    <>
      <div className={`achv ${open ? 'achv--open' : ''}`}>
        {open && (
          <div className="achv__list">
            <p className="achv__title label">secrets · {count}/{total}</p>
            {VISIBLE_SECRETS.map((s) => {
              const got = unlocked.includes(s.id)
              return (
                <div key={s.id} className={`achv__item ${got ? 'is-got' : ''}`}>
                  <span className="achv__emoji">{got ? s.emoji : '❔'}</span>
                  <span className="achv__label">{got ? s.label : '???'}</span>
                  <span className="achv__hint">{got ? s.hint : 'locked'}</span>
                </div>
              )
            })}
          </div>
        )}
        <button
          className="achv__toggle"
          data-cursor
          onClick={() => setOpen((o) => !o)}
          aria-label={`Secrets found: ${count} of ${total}`}
        >
          🗝 {count}/{total}
        </button>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="achv-toast"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, x: '-50%', y: 16 }}
            animate={{ opacity: 1, x: '-50%', y: 0 }}
            exit={{ opacity: 0, x: '-50%', y: 16 }}
          >
            {toast.emoji} secret unlocked · <strong>{toast.label}</strong>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
