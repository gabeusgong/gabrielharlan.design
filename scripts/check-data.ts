/* Data-integrity check for the content in src/data.ts.
 *
 * The site is entirely data-driven — notes, projects, and the cross-links and
 * pre-rendered pages built from them. A typo in a slug or a note pointing at a
 * project that doesn't exist would ship a broken link or a dead card. This runs
 * in CI before the build so that can't reach production. Exits non-zero on any
 * failure.
 */
import { notes, projects } from '../src/data'

const errors: string[] = []
const err = (msg: string) => errors.push(msg)

const studySlugs = new Set(
  projects.filter((p) => p.study).map((p) => p.study as string),
)

// ---- projects ----
const seenStudy = new Set<string>()
for (const p of projects) {
  const id = p.title
  if (!p.title?.trim()) err(`project: empty title`)
  if (!p.blurb?.trim()) err(`project "${id}": empty blurb`)
  if (!p.emoji?.trim()) err(`project "${id}": empty emoji`)
  if (!p.tags?.length) err(`project "${id}": no tags`)
  if (p.caseStudy && !p.study) err(`project "${id}": caseStudy is true but no study slug`)
  if (p.study) {
    if (seenStudy.has(p.study)) err(`project "${id}": duplicate study slug "${p.study}"`)
    seenStudy.add(p.study)
  }
}

// ---- notes ----
const seenSlug = new Set<string>()
for (const n of notes) {
  const id = n.slug || n.title || '(unknown)'
  if (!n.slug?.trim()) err(`note "${id}": empty slug`)
  if (n.slug && seenSlug.has(n.slug)) err(`note "${id}": duplicate slug`)
  if (n.slug) seenSlug.add(n.slug)
  if (n.slug && !/^[a-z0-9-]+$/.test(n.slug)) err(`note "${id}": slug should be kebab-case`)
  if (!n.title?.trim()) err(`note "${id}": empty title`)
  if (!n.dek?.trim()) err(`note "${id}": empty dek`)
  if (!n.tags?.length) err(`note "${id}": no tags`)
  if (!n.body?.length) err(`note "${id}": empty body`)
  if (!(n.minutes > 0)) err(`note "${id}": minutes must be > 0`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(n.date) || Number.isNaN(Date.parse(n.date)))
    err(`note "${id}": invalid date "${n.date}" (want YYYY-MM-DD)`)
  if (n.study && !studySlugs.has(n.study))
    err(`note "${id}": study "${n.study}" does not match any project`)
}

if (errors.length) {
  console.error(`✗ data check failed — ${errors.length} problem(s):`)
  for (const e of errors) console.error(`  • ${e}`)
  process.exit(1)
}

console.log(
  `✓ data check passed — ${notes.length} notes, ${projects.length} projects, ${studySlugs.size} case studies, all links resolve`,
)
