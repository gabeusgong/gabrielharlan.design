import { motion } from 'motion/react'
import { profile, links } from '../data'
import Reveal from './Reveal'

const rows = [
  { key: 'email', label: 'Email', value: links.email, href: `mailto:${links.email}` },
  { key: 'github', label: 'GitHub', value: links.github, href: links.github },
  { key: 'linkedin', label: 'LinkedIn', value: links.linkedin, href: links.linkedin },
  { key: 'twitter', label: 'Twitter / X', value: links.twitter, href: links.twitter },
].filter((r) => r.value)

export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <Reveal>
        <p className="label">
          <span className="tick">04</span> / let&apos;s talk
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <h2 className="contact__heading">
          Got something
          <br />
          <span className="contact__big">weird &amp; useful</span>
          <br />
          to build?
        </h2>
      </Reveal>

      <Reveal delay={0.12}>
        <ul className="contact__list">
          {rows.map((r) => (
            <li key={r.key}>
              <motion.a
                href={r.href}
                target={r.key === 'email' ? undefined : '_blank'}
                rel="noreferrer"
                className="contact__row"
                data-cursor
                whileHover={{ x: 14 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <span className="contact__row-label label">{r.label}</span>
                <span className="contact__row-value">{r.value}</span>
                <span className="contact__row-arrow">↗</span>
              </motion.a>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.18}>
        <a
          className="btn btn--solid btn--resume contact__resume"
          href="./Gabriel-Harlan-Resume.pdf"
          target="_blank"
          rel="noreferrer"
          data-cursor
        >
          Download résumé ↓
        </a>
      </Reveal>

      <footer className="footer">
        <span className="label">
          © {profile.name} — built with too much care &amp; a little chaos
        </span>
        <a href="#top" className="footer__top label" data-cursor>
          back to top ↑
        </a>
      </footer>
    </section>
  )
}
