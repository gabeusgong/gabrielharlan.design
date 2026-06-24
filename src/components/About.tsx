import { motion } from 'motion/react'
import { profile, hobbies, tones } from '../data'
import Reveal from './Reveal'

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="about__grid">
        <div className="about__text">
          <Reveal>
            <p className="label about__eyebrow">
              <span className="tick">01</span> / who&apos;s this
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="about__heading">
              Hi — I&apos;m {profile.name.split(' ')[0]}.
              <span className="about__wink"> Nice to meet you.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="about__body">{profile.about}</p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="about__stickers-col">
          <div className="about__sticker-note label">drag me →</div>
          <div className="stickerboard">
            {hobbies.map((h, i) => (
              <motion.button
                key={h.label}
                className="sticker"
                data-cursor
                drag
                dragMomentum={false}
                dragElastic={0.18}
                whileDrag={{ scale: 1.12, rotate: 0, zIndex: 50 }}
                whileHover={{ scale: 1.08, rotate: 0 }}
                initial={{ rotate: h.rotate }}
                style={{
                  rotate: h.rotate,
                  background: tones[h.tone],
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                aria-label={h.label}
              >
                <span className="sticker__emoji">{h.emoji}</span>
                <span className="sticker__label">{h.label}</span>
                {/* fake peel corner */}
                <span className="sticker__peel" />
                {/* index for fun */}
                <span className="sticker__no">{String(i + 1).padStart(2, '0')}</span>
              </motion.button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
