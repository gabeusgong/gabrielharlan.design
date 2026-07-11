# TODO — future additions

Ideas for the next round of work on gabrielharlan.is-a.dev. ⭐ = highest impact.

## Portfolio depth (best ROI for the job hunt)
- [x] ⭐ **More case studies** — ✅ **ITIT capstone** (data-model diagram) and ✅ **Corne 42 LP
      keyboard** (interactive Base/Lower/Raise keymap diagram built from the real `goozmk-config1`
      ZMK config; links the public repo) both have full case-study modals. CaseStudy.tsx is now
      data-driven (karst / itit / corne). All three projects now tell a full story.
- [x] **Process / "how I work" beat** — a couple of wireframe→final shots or a short
      blurb on the design loop. Show the UX thinking, not just the result.
- [x] **A testimonial** — one short quote from a professor, teammate, or the IT-team lead.
- [x] ⭐ **Field Notes** — a writing section on its own route (`#/notes`, list + article views),
      authored inline in `data.ts` (`notes`). Seeded with three posts drawn from real work: Karst
      geoprivacy design, the TRACI SMS build ("the plumbing is the product"), and UX lessons from
      leading the IU IT team. Lazy-loaded (1.29 KB gzip chunk) so the initial bundle is untouched.
      Shows how I think, not just what I shipped — best remaining ROI for the job hunt.

## Walk-the-talk accessibility (the hero literally says "accessible")
- [x] ⭐ **Accessibility pass**
  - [x] Visible `:focus-visible` focus ring site-wide (amber in cave mode)
  - [x] Skip-to-content link; `<main>` landmark
  - [—] Reduced-motion mode removed per request (caused a flicker in the sticker game); animations always play now
  - [x] Allow pinch-zoom (removed `user-scalable=no` / `maximum-scale`)
  - [x] Screen-reader hobbies list; polite live region for unlock toasts
  - [x] Keyboard-operable sticker game — stickers focusable; arrow keys / space fling them
  - [x] Color-contrast reviewed (body text AA on cream & dark; accents for large/decorative only)

## Performance
- [x] **Lazy-load matter-js** — done via `StickerPlayground.tsx` (React.lazy + IntersectionObserver).
      Initial JS bundle dropped **139.8 → 112.8 KB gzip**; physics engine is now a 28.6 KB chunk
      loaded only as About scrolls near.

## Delight / signature
- [x] ⭐ **Keyboard Easter egg** — type a secret word (e.g. `karst`) or the Konami code to
      trigger something playful. On-brand for the keyboard nerd.
- [x] **Sound + mute toggle** — subtle clicks on sticker collisions, a chime on the win.
- [x] **"/now" line** — "currently building Karst · reading X · deepest cave so far",
      kept fresh, to make the site feel alive.

## Gimmicks (pure delight)
- [x] **Scroll-velocity marquee** — the skills marquee speeds up / slows / reverses based on
      scroll speed and direction. Quick to add, high impact.
- [x] **"Meters deep" depth gauge** — slim left-side gauge that fills as you scroll, labeled
      like a cave descent (entrance → twilight zone → deep). On-theme + orienting.
- [x] **Idle surprise** — after ~20s of no input, a stray sticker drops in / the bat peeks
      out / the headlamp flickers.
- [x] **More physics** — make the project cards (or hero letters) throwable: fling them
      around with matter-js, then they spring back into place.

## Bigger / interactive (standouts)
- [x] ⭐ **Visitor sticker wall / guestbook (Firebase)** — live Firestore wall (`gabrielharlan-site`
      project); "explorer #N" counter via atomic transaction, once per visitor. Firebase lazy-loaded
      into its own chunk. Security rules (`firestore.rules`): public read, validated creates, no
      edits/deletes, counter only +1.
- [x] ⭐ **"Explorer" achievements** — 🗝 X/5 secrets chip + unlock toasts (cave / ring / bat /
      fling / Konami). See `src/lib/achievements.ts`.
- [x] **Interactive Corne keyboard** — the case-study keymap has 42 clickable keycaps that depress
      and play a synthesized Web Audio "thock" (no audio files). Sound-toggle still a future item.
- [x] **Cave cross-section scroll** — an SVG cave profile you visually descend through as you
      scroll, tied to the depth gauge.

## More delight ideas
- [x] **Deepen cave mode** — ✅ water-drip ambience (silenceable via mute) + the depth-gauge
      cave cross-section recolors amber-on-black in cave mode. (Bat removed.)
- [x] **Real cave photos** — ✅ "Underground" gallery section: featured hero shot + 23-photo masonry
      grid with a keyboard-navigable lightbox (`CaveGallery.tsx`, lazy-loaded; `public/caves/*.webp`).
      Plus a portrait polaroid in the About intro (`public/portrait.webp`).
- [x] **`/` command palette / fake terminal** — jump to sections or run `whoami` / `ls projects`.
- [x] **Now-playing chip** — Last.fm / Spotify "currently listening" for a living, personal touch.
- [x] **Blob parallax / gyro tilt** — hero blobs drift with the mouse (desktop) or phone tilt (gyro).
- [x] **Time-aware greeting** — hero eyebrow greets by the visitor's local hour; "welcome back"
      for returning visitors (localStorage).
- [—] **Chaos / motion dial** — removed along with reduced-motion mode (per request).
- [x] **Animated nav mark** — the ✸ flaps into a bat on hover.
- [x] **Visitor count** — "you're explorer #N" (shipped with the Firebase wall).
- [x] **First-visit intro** — a brief headlamp-on "descent" before the hero (optional; mind load friction).

## Practical
- [x] **Privacy-friendly analytics** (e.g. Plausible) to see traffic when sharing for jobs.
- [x] **Real light/dark toggle** beyond cave mode.
- [x] **Installable PWA** — manifest + service worker ("add to home screen"). Deferred.
- [~] **Contact form** (e.g. Formspree) so people can message without an email client. Deferred.

## Shipped 2026-06-30
Custom 404 page · JSON-LD/SEO meta · "view source" footer · WebP case-study images
(1 MB→~100 KB) · copy-to-clipboard email + toast · inactive-tab title egg · sticker-game
best time (localStorage) · scroll-velocity marquee · depth gauge · idle bat · throwable cards.
Plus coworker fixes: cursor hides on exit + no blend flicker; modal scroll containment + de-jank.

---

### Notes
- ✅ Custom domain **gabrielharlan.is-a.dev** is LIVE (is-a.dev PR #41704 merged, HTTPS on).
- ✅ Dead-reckoning case-study image = the live "Record a route" recording screen.

**Top picks next:** ⭐ visitor guestbook (Firebase) · more case studies · accessibility pass · keyboard Easter egg.
