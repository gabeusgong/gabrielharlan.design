/* ============================================================
   YOUR CONTENT LIVES HERE 👋
   Everything below is a PLACEHOLDER seeded with the little I know.
   Swap in your real details and the whole site updates.
   (Search for "TODO" to find the spots most in need of your input.)
   ============================================================ */

export const profile = {
  name: 'Gabriel Harlan',
  // TODO: your hero one-liner — keep it punchy and a little weird
  tagline: 'Software engineer who builds weird, useful things.',
  // shown as rotating words in the hero
  iAm: ['an engineer', 'a tinkerer', 'a problem-solver', 'a builder'],
  // TODO: 2–3 sentences in your real voice
  about:
    "I'm a software engineer who likes the messy middle — the place where a half-formed idea turns into something people actually use. I care about craft, fast feedback loops, and shipping things that feel good to touch. When I'm not at a keyboard you'll probably find me chasing one of the obsessions below.",
  location: 'Somewhere with good coffee', // TODO
  status: 'open to interesting things', // little status pill in the nav
}

export type Skill = { name: string; tone: keyof typeof tones }
export const tones = {
  coral: 'var(--coral)',
  cobalt: 'var(--cobalt)',
  lime: 'var(--lime)',
  pink: 'var(--pink)',
  sun: 'var(--sun)',
} as const

// TODO: replace with your real toolkit. tone just sets the color.
export const skills: Skill[] = [
  { name: 'TypeScript', tone: 'cobalt' },
  { name: 'React', tone: 'coral' },
  { name: 'Node.js', tone: 'lime' },
  { name: 'Firebase / Firestore', tone: 'sun' },
  { name: 'Java', tone: 'pink' },
  { name: 'Python', tone: 'cobalt' },
  { name: 'PostgreSQL', tone: 'coral' },
  { name: 'CSS / Motion', tone: 'lime' },
  { name: 'System Design', tone: 'sun' },
  { name: 'Testing', tone: 'pink' },
]

// Draggable sticker badges — your hobbies / interests.
// TODO: make these actually about you. emoji + label.
export type Sticker = {
  emoji: string
  label: string
  tone: keyof typeof tones
  rotate: number
}
export const hobbies: Sticker[] = [
  { emoji: '🧗', label: 'spelunking', tone: 'sun', rotate: -8 },
  { emoji: '🎧', label: 'making playlists', tone: 'cobalt', rotate: 6 },
  { emoji: '📷', label: 'film photography', tone: 'coral', rotate: -4 },
  { emoji: '☕', label: 'over-engineered coffee', tone: 'pink', rotate: 9 },
  { emoji: '🌱', label: 'growing things', tone: 'lime', rotate: -10 },
  { emoji: '🎲', label: 'board games', tone: 'sun', rotate: 5 },
  { emoji: '🚲', label: 'long bike rides', tone: 'cobalt', rotate: -6 },
  { emoji: '📚', label: 'sci-fi paperbacks', tone: 'coral', rotate: 7 },
]

export type Project = {
  title: string
  blurb: string
  tags: string[]
  tone: keyof typeof tones
  href?: string
  year?: string
  emoji: string
}

// TODO: your real projects. The first one is seeded from what I know.
export const projects: Project[] = [
  {
    title: 'Spelunk-a-Dunk',
    blurb:
      'A location-aware app for cave explorers — with a geoprivacy layer that obfuscates sensitive coordinates instead of exposing them. Firestore rules, admin tooling, the works.',
    tags: ['React', 'Firestore', 'Geoprivacy', 'Java'],
    tone: 'sun',
    year: '2025',
    emoji: '🗺️',
    // href: 'https://...',
  },
  {
    title: 'Project Two',
    blurb:
      'TODO — a one-line description of what it does and why it was fun or hard to build. Lead with the interesting part.',
    tags: ['TypeScript', 'Node'],
    tone: 'coral',
    year: '2024',
    emoji: '🛠️',
  },
  {
    title: 'Project Three',
    blurb:
      'TODO — another thing you made. Side project, work project, weekend hack — whatever you’re proud of.',
    tags: ['Python', 'Data'],
    tone: 'cobalt',
    year: '2023',
    emoji: '⚙️',
  },
  {
    title: 'Project Four',
    blurb:
      'TODO — optional. Delete this card if you only want three, or add more by editing data.ts.',
    tags: ['Design', 'CSS'],
    tone: 'pink',
    year: '2023',
    emoji: '✨',
  },
]

// TODO: your real links. Leave href empty to hide a row.
export const links = {
  email: 'gharlan@tirerack.com',
  github: '', // 'https://github.com/yourname'
  linkedin: '', // 'https://linkedin.com/in/yourname'
  twitter: '', // 'https://x.com/yourname'
}
