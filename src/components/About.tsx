import { useEffect, useRef } from 'react'
import Matter from 'matter-js'
import { profile, hobbies, tones } from '../data'
import Reveal from './Reveal'

/* A gravity sandbox: the hobby stickers drop in, pile up, and can be
   grabbed and flung around with real collisions (matter-js). */
function StickerPlayground() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    const {
      Engine,
      Runner,
      Bodies,
      Body,
      Composite,
      Mouse,
      MouseConstraint,
      Events,
    } = Matter

    let width = scene.clientWidth
    let height = scene.clientHeight

    const engine = Engine.create()
    engine.gravity.y = 1.1

    const wallOpts = { isStatic: true, render: { visible: false } }
    const T = 400 // wall thickness (generous so nothing tunnels out)
    const floor = Bodies.rectangle(width / 2, height + T / 2, width * 4, T, wallOpts)
    const left = Bodies.rectangle(-T / 2, height / 2, T, height * 4, wallOpts)
    const right = Bodies.rectangle(width + T / 2, height / 2, T, height * 4, wallOpts)
    Composite.add(engine.world, [floor, left, right])

    // one physics body per sticker, sized to the measured DOM node
    const pairs = itemRefs.current
      .map((el, i) => {
        if (!el) return null
        const w = el.offsetWidth
        const h = el.offsetHeight
        const x = Math.max(w, Math.min(width - w, 40 + Math.random() * (width - 80)))
        const y = -120 - i * 90 // start above the board so they rain in
        const body = Bodies.rectangle(x, y, w, h, {
          restitution: 0.45,
          friction: 0.5,
          frictionAir: 0.015,
          chamfer: { radius: 12 },
          angle: (Math.random() - 0.5) * 0.6,
        })
        return { el, body }
      })
      .filter((p): p is { el: HTMLDivElement; body: Matter.Body } => p !== null)

    Composite.add(engine.world, pairs.map((p) => p.body))

    // drag + throw
    const mouse = Mouse.create(scene)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.18, render: { visible: false } },
    })
    Composite.add(engine.world, mouseConstraint)

    const runner = Runner.create()
    Runner.run(runner, engine)

    const sync = () => {
      for (const { el, body } of pairs) {
        el.style.transform =
          `translate(${body.position.x - el.offsetWidth / 2}px, ` +
          `${body.position.y - el.offsetHeight / 2}px) rotate(${body.angle}rad)`
      }
    }
    Events.on(engine, 'afterUpdate', sync)

    // keep walls aligned if the board's width changes (responsive)
    const ro = new ResizeObserver(() => {
      if (!sceneRef.current) return
      width = sceneRef.current.clientWidth
      height = sceneRef.current.clientHeight
      Body.setPosition(floor, { x: width / 2, y: height + T / 2 })
      Body.setPosition(right, { x: width + T / 2, y: height / 2 })
    })
    ro.observe(scene)

    return () => {
      ro.disconnect()
      Events.off(engine, 'afterUpdate', sync)
      Runner.stop(runner)
      Composite.clear(engine.world, false)
      Engine.clear(engine)
    }
  }, [])

  return (
    <div className="stickerboard" ref={sceneRef}>
      {hobbies.map((h, i) => (
        <div
          key={h.label}
          ref={(el) => {
            itemRefs.current[i] = el
          }}
          className="sticker"
          style={{ background: tones[h.tone] }}
          data-cursor
          aria-label={h.label}
        >
          <span className="sticker__emoji">{h.emoji}</span>
          <span className="sticker__label">{h.label}</span>
          <span className="sticker__peel" />
          <span className="sticker__no">{String(i + 1).padStart(2, '0')}</span>
        </div>
      ))}
    </div>
  )
}

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
              Hi — I&apos;m Gabe.
              <span className="about__wink"> Nice to meet you.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="about__body">{profile.about}</p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="about__stickers-col">
          <div className="about__sticker-note label">grab &amp; fling →</div>
          <StickerPlayground />
        </Reveal>
      </div>
    </section>
  )
}
