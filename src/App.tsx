import { useState, useEffect } from 'react'
import './App.css'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import CaveMode from './components/CaveMode'
import DepthGauge from './components/DepthGauge'
import IdleSurprise from './components/IdleSurprise'
import Achievements from './components/Achievements'
import { unlock } from './lib/achievements'

function App() {
  const [cave, setCave] = useState(false)

  const toggleCave = () =>
    setCave((v) => {
      if (!v) unlock('cave')
      return !v
    })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCave(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // playful tab title when you leave the tab
  useEffect(() => {
    const original = document.title
    const onVis = () => {
      document.title = document.hidden ? '🦇 come back…' : original
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      document.title = original
    }
  }, [])

  return (
    <>
      <Cursor />
      <DepthGauge />
      <Nav cave={cave} onToggleCave={toggleCave} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <CaveMode active={cave} />
      <IdleSurprise />
      <Achievements />
    </>
  )
}

export default App
