/* Shared user preferences: theme (light/dark), motion, and sound (mute).
   Each is null = "follow the OS / default"; an explicit value overrides.
   Resolved values are written to <html data-theme> / <html data-motion> so CSS
   can react, and a 'pref-change' event lets components re-read. */

const THEME_KEY = 'gh-theme'
const MOTION_KEY = 'gh-motion'
const MUTED_KEY = 'gh-muted'

const get = (k: string) => {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
const set = (k: string, v: string | null) => {
  try {
    if (v === null) localStorage.removeItem(k)
    else localStorage.setItem(k, v)
  } catch {
    /* ignore */
  }
}

const mq = (q: string) =>
  typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q).matches : false

export const prefersDark = () => mq('(prefers-color-scheme: dark)')
export const prefersReduced = () => mq('(prefers-reduced-motion: reduce)')

export type Theme = 'dark' | 'light' | null
export const getTheme = (): Theme => {
  const v = get(THEME_KEY)
  return v === 'dark' || v === 'light' ? v : null
}
export const resolvedDark = () => {
  const t = getTheme()
  return t ? t === 'dark' : prefersDark()
}
export const setTheme = (v: Theme) => {
  set(THEME_KEY, v)
  apply()
  emit()
}

export type Motion = 'reduced' | 'full' | null
export const getMotion = (): Motion => {
  const v = get(MOTION_KEY)
  return v === 'reduced' || v === 'full' ? v : null
}
export const resolvedReduced = () => {
  const m = getMotion()
  return m ? m === 'reduced' : prefersReduced()
}
export const setMotion = (v: Motion) => {
  set(MOTION_KEY, v)
  apply()
  emit()
}

export const isMuted = () => get(MUTED_KEY) === '1'
export const setMuted = (b: boolean) => {
  set(MUTED_KEY, b ? '1' : '0')
  emit()
}

export const apply = () => {
  if (typeof document === 'undefined') return
  const r = document.documentElement
  r.dataset.theme = resolvedDark() ? 'dark' : 'light'
  r.dataset.motion = resolvedReduced() ? 'reduced' : 'full'
}

const emit = () => window.dispatchEvent(new CustomEvent('pref-change'))
