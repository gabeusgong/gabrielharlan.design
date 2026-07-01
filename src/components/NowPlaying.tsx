import { useEffect, useState } from 'react'

// Last.fm (Apple Music scrobbles here via a helper app). The API key is a
// client key and safe to ship. Set to '' to hide the chip.
const USER = 'gabeusgong'
const API_KEY = '10ed12f9dd116bc495ff66f0aae00e21'

type Track = { name: string; artist: string; url: string; now: boolean }

export default function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null)

  useEffect(() => {
    if (!USER || !API_KEY) return
    let alive = true
    const fetchTrack = async () => {
      try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USER}&api_key=${API_KEY}&format=json&limit=1`
        const res = await fetch(url)
        if (!res.ok) return
        const data = await res.json()
        const t = data?.recenttracks?.track?.[0]
        if (!t || !alive) return
        setTrack({
          name: t.name,
          artist: t.artist?.['#text'] ?? '',
          url: t.url ?? '#',
          now: t['@attr']?.nowplaying === 'true',
        })
      } catch {
        /* offline / rate-limited — just hide */
      }
    }
    fetchTrack()
    const id = window.setInterval(fetchTrack, 60000)
    return () => {
      alive = false
      window.clearInterval(id)
    }
  }, [])

  if (!track) return null

  return (
    <a
      className={`nowplaying ${track.now ? 'nowplaying--live' : ''}`}
      href={track.url}
      target="_blank"
      rel="noreferrer"
      data-cursor
      title="via Last.fm"
    >
      <span className="nowplaying__eq" aria-hidden>
        <i />
        <i />
        <i />
      </span>
      <span className="nowplaying__label label">
        {track.now ? 'now playing' : 'last played'}
      </span>
      <span className="nowplaying__track">
        {track.name}
        {track.artist ? ` — ${track.artist}` : ''}
      </span>
    </a>
  )
}
