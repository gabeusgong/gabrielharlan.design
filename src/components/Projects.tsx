import type { MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { projects, tones, type Project } from '../data'
import Reveal from './Reveal'

function TiltCard({ p, index }: { p: Project; index: number }) {
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), {
    stiffness: 200,
    damping: 18,
  })
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), {
    stiffness: 200,
    damping: 18,
  })

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const reset = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  const big = index === 0
  const Tag = (p.href ? motion.a : motion.div) as typeof motion.a

  return (
    <Reveal delay={index * 0.06} className={big ? 'card-col card-col--wide' : 'card-col'}>
      <Tag
        href={p.href}
        target={p.href ? '_blank' : undefined}
        rel={p.href ? 'noreferrer' : undefined}
        className={`card ${big ? 'card--feature' : ''}`}
        data-cursor
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{
          rotateX: rx,
          rotateY: ry,
          transformPerspective: 900,
          background: 'var(--paper)',
        }}
        whileHover={{ y: -6 }}
      >
        <span className="card__swatch" style={{ background: tones[p.tone] }} />
        <div className="card__top">
          <span className="card__emoji">{p.emoji}</span>
          <span className="label card__year">{p.year}</span>
        </div>
        <h3 className="card__title">{p.title}</h3>
        <p className="card__blurb">{p.blurb}</p>
        <div className="card__tags">
          {p.tags.map((t) => (
            <span className="card__tag" key={t}>
              {t}
            </span>
          ))}
        </div>
        <span className="card__cta">
          {p.href ? 'Visit' : 'Case study soon'} <span className="card__arrow">→</span>
        </span>
      </Tag>
    </Reveal>
  )
}

export default function Projects() {
  return (
    <section className="section work" id="work">
      <div className="work__head">
        <Reveal>
          <p className="label">
            <span className="tick">03</span> / selected work
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="work__heading">
            Things I&apos;ve <span className="work__under">built.</span>
          </h2>
        </Reveal>
      </div>

      <div className="work__grid">
        {projects.map((p, i) => (
          <TiltCard key={p.title} p={p} index={i} />
        ))}
      </div>
    </section>
  )
}
