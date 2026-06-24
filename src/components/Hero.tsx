import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { profile } from '../data'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
}
const letter = {
  hidden: { y: '120%', rotate: 8, opacity: 0 },
  show: {
    y: '0%',
    rotate: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 220, damping: 18 },
  },
}

function KineticName({ text }: { text: string }) {
  let idx = 0
  return (
    <motion.h1
      className="hero__name"
      variants={container}
      initial="hidden"
      animate="show"
      aria-label={text}
    >
      {text.split(' ').map((word, wi) => (
        <span className="hero__word" key={wi} aria-hidden>
          {word.split('').map((ch) => {
            const i = idx++
            return (
              <span className="hero__letter-wrap" key={i}>
                <motion.span className="hero__letter" variants={letter}>
                  {ch}
                </motion.span>
              </span>
            )
          })}
        </span>
      ))}
    </motion.h1>
  )
}

function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % words.length), 2200)
    return () => clearInterval(t)
  }, [words.length])

  return (
    <span className="hero__rotator">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: '0.9em', opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-0.9em', opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function Hero() {
  return (
    <header className="hero" id="top">
      {/* floating playground shapes */}
      <motion.div
        className="blob blob--coral"
        animate={{ y: [0, -24, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="blob blob--cobalt"
        animate={{ y: [0, 26, 0], x: [0, -14, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="blob blob--lime"
        animate={{ y: [0, -18, 0], rotate: [0, -16, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="hero__inner">
        <motion.p
          className="label hero__eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          ✦ {profile.location} · portfolio &apos;26
        </motion.p>

        <KineticName text={profile.name} />

        <motion.p
          className="hero__sub"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          I&apos;m <RotatingWord words={profile.iAm} />. {profile.tagline}
        </motion.p>

        <motion.div
          className="hero__cta"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <a className="btn btn--solid" href="#work" data-cursor>
            See the work →
          </a>
          <a className="btn btn--ghost" href="#contact" data-cursor>
            Say hello
          </a>
          <a
            className="btn btn--ghost btn--resume"
            href="./Gabriel-Harlan-Resume.pdf"
            target="_blank"
            rel="noreferrer"
            data-cursor
          >
            Résumé ↓
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <span className="label">scroll</span>
        <motion.span
          className="hero__scroll-line"
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </motion.a>
    </header>
  )
}
