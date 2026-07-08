/* Shared user preferences. The site is light-only — the former dark theme is
   replaced by the flashlight (cave mode), toggled from the UI. This module just
   persists the sound (mute) pref and broadcasts a 'pref-change' event so
   components can re-read. */

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

export const isMuted = () => get(MUTED_KEY) === '1'
export const setMuted = (b: boolean) => {
  set(MUTED_KEY, b ? '1' : '0')
  emit()
}

const emit = () => window.dispatchEvent(new CustomEvent('pref-change'))
