import { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'
import { profile, hobbies, tones } from '../data'
import Reveal from './Reveal'

const CONFETTI = ['#f4502a', '#2d4df5', '#c8f02c', '#ff9ece', '#ffc23d']

/* Gravity sandbox + hidden game. Stickers pile in the bordered box at the
   bottom; the play area extends up the whole column. Fling a sticker and a
   basketball hoop mounted on the right wall appears — sink every sticker
   through it (fling up-and-right) for a confetti "YOU WON". */
function StickerPlayground() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])
  const hoopRef = useRef<HTMLDivElement>(null)
  const resetRef = useRef<() => void>(() => {})

  const [active, setActive] = useState(false)
  const [score, setScore] = useState(0)
  const [won, setWon] = useState(false)

  const total = hobbies.length

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    const { Engine, Runner, Bodies, Body, Composite, Mouse, MouseConstraint, Events } =
      Matter

    let width = scene.clientWidth
    let height = scene.clientHeight

    const engine = Engine.create()
    engine.gravity.y = 1.1

    const wallOpts = { isStatic: true, render: { visible: false } }
    const T = 600
    // full-height walls + floor + ceiling so stickers stay inside the tall column
    const floor = Bodies.rectangle(width / 2, height + T / 2, width * 4, T, wallOpts)
    const ceil = Bodies.rectangle(width / 2, -T / 2, width * 4, T, wallOpts)
    const left = Bodies.rectangle(-T / 2, height / 2, T, height * 4, wallOpts)
    const right = Bodies.rectangle(width + T / 2, height / 2, T, height * 4, wallOpts)
    Composite.add(engine.world, [floor, ceil, left, right])

    // hoop sensor mounted on the right wall, upper area
    const hoopR = 38
    const hoopPos = () => ({ x: width - 47, y: height * 0.18 })
    const hoop = Bodies.circle(hoopPos().x, hoopPos().y, hoopR, {
      isStatic: true,
      isSensor: true,
      label: 'hoop',
    })
    Composite.add(engine.world, hoop)
    const placeHoop = () => {
      const p = hoopPos()
      Body.setPosition(hoop, p)
      if (hoopRef.current) hoopRef.current.style.top = `${p.y}px`
    }
    placeHoop()

    // stickers spawn near the top of the box area and fall into the pile
    const startX = () => 50 + Math.random() * Math.max(40, width - 100)
    const startY = (i: number) => 30 + (i % 5) * 26

    const pairs = itemRefs.current
      .map((el, i) => {
        if (!el) return null
        const body = Bodies.rectangle(startX(), startY(i), el.offsetWidth, el.offsetHeight, {
          restitution: 0.5,
          friction: 0.5,
          frictionAir: 0.012,
          chamfer: { radius: 12 },
          angle: (Math.random() - 0.5) * 0.6,
        })
        return { el, body, i }
      })
      .filter((p): p is { el: HTMLDivElement; body: Matter.Body; i: number } => p !== null)

    Composite.add(engine.world, pairs.map((p) => p.body))
    const indexByBody = new Map<number, number>()
    pairs.forEach((p) => indexByBody.set(p.body.id, p.i))

    const burst = (x: number, y: number, n = 22) => {
      for (let k = 0; k < n; k++) {
        const p = document.createElement('span')
        p.className = 'confetti'
        const ang = Math.random() * Math.PI * 2
        const dist = 40 + Math.random() * 130
        p.style.left = `${x}px`
        p.style.top = `${y}px`
        p.style.background = CONFETTI[k % CONFETTI.length]
        p.style.setProperty('--dx', `${Math.cos(ang) * dist}px`)
        p.style.setProperty('--dy', `${Math.sin(ang) * dist - 50}px`)
        p.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`)
        scene.appendChild(p)
        window.setTimeout(() => p.remove(), 1100)
      }
    }

    const scored = new Set<number>()
    let isActive = false
    const activate = () => {
      if (!isActive) {
        isActive = true
        setActive(true)
      }
    }

    const mouse = Mouse.create(scene)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.18, render: { visible: false } },
    })
    Composite.add(engine.world, mouseConstraint)

    let pending: Matter.Body | null = null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Events.on(mouseConstraint, 'enddrag', (e: any) => {
      pending = (e?.body as Matter.Body) ?? null
    })

    Events.on(engine, 'collisionStart', (evt: Matter.IEventCollision<Matter.Engine>) => {
      if (!isActive) return
      for (const pair of evt.pairs) {
        const other =
          pair.bodyA.label === 'hoop'
            ? pair.bodyB
            : pair.bodyB.label === 'hoop'
              ? pair.bodyA
              : null
        if (!other) continue
        const idx = indexByBody.get(other.id)
        if (idx === undefined || scored.has(idx)) continue
        scored.add(idx)
        burst(other.position.x, other.position.y)
        Composite.remove(engine.world, other)
        itemRefs.current[idx]?.classList.add('sticker--scored')
        setScore(scored.size)
        if (scored.size === total) {
          burst(width / 2, height / 2, 60)
          setWon(true)
        }
      }
    })

    type Handler = (e: Event) => void
    const m = mouse as unknown as { mousedown: Handler; mousemove: Handler; mouseup: Handler }
    scene.removeEventListener('touchstart', m.mousedown)
    scene.removeEventListener('touchmove', m.mousemove)
    scene.removeEventListener('touchend', m.mouseup)
    scene.addEventListener('touchstart', m.mousedown, { passive: false })
    scene.addEventListener('touchmove', m.mousemove, { passive: false })
    scene.addEventListener('touchend', m.mouseup, { passive: false })

    const runner = Runner.create()
    Runner.run(runner, engine)

    const sync = () => {
      for (const { el, body } of pairs) {
        el.style.transform =
          `translate(${body.position.x - el.offsetWidth / 2}px, ` +
          `${body.position.y - el.offsetHeight / 2}px) rotate(${body.angle}rad)`
      }
      if (pending) {
        if (!isActive && pending.speed > 4) activate()
        pending = null
      }
    }
    Events.on(engine, 'afterUpdate', sync)

    resetRef.current = () => {
      pairs.forEach((p) => {
        if (scored.has(p.i)) Composite.add(engine.world, p.body)
        Body.setPosition(p.body, { x: startX(), y: startY(p.i) })
        Body.setVelocity(p.body, { x: 0, y: 0 })
        Body.setAngularVelocity(p.body, 0)
        p.el.classList.remove('sticker--scored')
      })
      scored.clear()
      setScore(0)
      setWon(false)
    }

    const ro = new ResizeObserver(() => {
      if (!sceneRef.current) return
      width = sceneRef.current.clientWidth
      height = sceneRef.current.clientHeight
      Body.setPosition(floor, { x: width / 2, y: height + T / 2 })
      Body.setPosition(ceil, { x: width / 2, y: -T / 2 })
      Body.setPosition(right, { x: width + T / 2, y: height / 2 })
      placeHoop()
    })
    ro.observe(scene)

    return () => {
      ro.disconnect()
      scene.removeEventListener('touchstart', m.mousedown)
      scene.removeEventListener('touchmove', m.mousemove)
      scene.removeEventListener('touchend', m.mouseup)
      Events.off(engine, 'afterUpdate', sync)
      Runner.stop(runner)
      Composite.clear(engine.world, false)
      Engine.clear(engine)
    }
  }, [total])

  return (
    <div className="playground" ref={sceneRef}>
      {/* decorative bordered box for the lower pile (side + bottom borders) */}
      <div className="playbox" aria-hidden />

      {/* basketball hoop mounted on the right wall (revealed on first fling) */}
      <div ref={hoopRef} className={`hoop ${active ? 'hoop--on' : ''}`} aria-hidden>
        <div className="hoop__net" />
        <div className="hoop__rim" />
        <div className="hoop__board" />
      </div>

      {active && !won && (
        <div className="game-hud label">
          🏀 {score} / {total} — fling them through the hoop!
        </div>
      )}

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

      {won && (
        <div className="game-win">
          <p className="game-win__big">YOU WON</p>
          <p className="game-win__sub">all {total} hobbies sunk 🎉</p>
          <button
            type="button"
            className="btn btn--solid"
            data-cursor
            onClick={() => resetRef.current()}
          >
            Play again ↺
          </button>
        </div>
      )}
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
