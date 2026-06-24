import { skills, tones } from '../data'

/* Two infinite marquees scrolling opposite directions.
   Each track is duplicated so the loop is seamless. */
function Track({ reverse }: { reverse?: boolean }) {
  const row = [...skills, ...skills]
  return (
    <div className={`marquee ${reverse ? 'marquee--rev' : ''}`}>
      <div className="marquee__track">
        {row.map((s, i) => (
          <span className="chip" key={i}>
            <span className="chip__dot" style={{ background: tones[s.tone] }} />
            {s.name}
            <span className="chip__star">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section className="skills" id="skills" aria-label="Skills and tools">
      <div className="skills__head section">
        <p className="label">
          <span className="tick">02</span> / the toolkit
        </p>
        <h2 className="skills__heading">Things I reach for.</h2>
      </div>
      <div className="skills__marquees">
        <Track />
        <Track reverse />
      </div>
    </section>
  )
}
