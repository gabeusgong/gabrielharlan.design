/* Fire a GoatCounter event (no-op if analytics hasn't loaded / is blocked). */
type GC = { count?: (o: { path: string; title?: string; event?: boolean }) => void }

export function track(name: string) {
  try {
    const gc = (window as unknown as { goatcounter?: GC }).goatcounter
    gc?.count?.({ path: name, title: name, event: true })
  } catch {
    /* ignore */
  }
}
