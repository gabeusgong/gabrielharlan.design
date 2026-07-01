import { useRef, useState } from 'react'

const SAMPLE = 'the best tools are the ones you tune yourself'

/* A tiny WPM typing test for the Corne case study — feel the keyboard the OLED
   is measuring. Hidden input; the sample line is the interactive display. */
export default function TypingTest() {
  const [typed, setTyped] = useState('')
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const done = typed.length >= SAMPLE.length
  const correct = [...typed].filter((c, i) => c === SAMPLE[i]).length
  const elapsedMin = startedAt ? (performance.now() - startedAt) / 60000 : 0
  const wpm = elapsedMin > 0 ? Math.round(correct / 5 / elapsedMin) : 0
  const acc = typed.length ? Math.round((correct / typed.length) * 100) : 100

  const onChange = (v: string) => {
    if (startedAt === null && v.length) setStartedAt(performance.now())
    // light up the pressed key on the keymap above
    if (v.length > typed.length) {
      window.dispatchEvent(new CustomEvent('corne-key', { detail: v[v.length - 1] }))
    }
    setTyped(v.slice(0, SAMPLE.length))
  }
  const reset = () => {
    setTyped('')
    setStartedAt(null)
    inputRef.current?.focus()
  }

  return (
    <div className="typetest" onClick={() => inputRef.current?.focus()}>
      <p className="typetest__sample" aria-hidden>
        {[...SAMPLE].map((ch, i) => {
          const state =
            i < typed.length ? (typed[i] === ch ? 'ok' : 'bad') : i === typed.length ? 'cur' : ''
          return (
            <span key={i} className={`typetest__ch ${state ? `typetest__ch--${state}` : ''}`}>
              {ch}
            </span>
          )
        })}
      </p>
      <input
        ref={inputRef}
        className="typetest__input"
        value={typed}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Type the sample sentence"
        spellCheck={false}
        autoComplete="off"
      />
      <div className="typetest__stats label">
        <span className="typetest__wpm">{wpm} wpm</span>
        <span>{acc}% acc</span>
        {done ? (
          <button type="button" className="typetest__again" onClick={reset} data-cursor>
            try again ↺
          </button>
        ) : (
          <span className="typetest__hint">click &amp; type it</span>
        )}
      </div>
    </div>
  )
}
