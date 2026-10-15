import { Component, lazy, Suspense, useLayoutEffect, useMemo, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SECTIONS } from '../data/config'
import { getQuality, useReducedMotion, useWebGL } from '../hooks/hooks'
import { scrollState } from '../three/scrollState'
import Nav from '../components/Nav'
import Cursor from '../components/Cursor'
import Hero from '../scenes/Hero'
import Spike from '../scenes/Spike'
import MapBreach from '../scenes/MapBreach'
import Agents from '../scenes/Agents'
import Intel from '../scenes/Intel'
import Finale from '../scenes/Finale'

gsap.registerPlugin(ScrollTrigger)
const ExperienceCanvas = lazy(() => import('../three/ExperienceCanvas'))
class Boundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? null : this.props.children }
}

export default function App() {
  const reduced = useReducedMotion()
  const webgl = useWebGL()
  const quality = useMemo(getQuality, [])
  const [active, setActive] = useState(0)

  // One global trigger converts scroll position into a continuous "section position" (0..6).
  // Pinned sections are measured through their pin-spacer so progress keeps moving while pinned.
  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: () => {
        const mid = innerHeight / 2; let s = 0
        SECTIONS.forEach(({ id }, i) => {
          const el = document.getElementById(id); if (!el) return
          const box = (el.parentElement.classList.contains('pin-spacer') ? el.parentElement : el).getBoundingClientRect()
          if (box.top <= mid) s = i + Math.min(1, (mid - box.top) / box.height)
        })
        scrollState.s = s
        setActive((a) => { const n = Math.min(5, Math.floor(s)); return a === n ? a : n })
      },
    })
    const refresh = () => ScrollTrigger.refresh()
    addEventListener('load', refresh)
    return () => { st.kill(); removeEventListener('load', refresh) }
  }, [])

  return (
    <div className={webgl ? '' : 'no-webgl'}>
      <Cursor />
      <Nav active={active} />
      {webgl && (
        <Boundary><Suspense fallback={<div className="loader">LOADING SCENE</div>}>
          <ExperienceCanvas quality={quality} reduced={reduced} />
        </Suspense></Boundary>
      )}
      <main>
        <Hero reduced={reduced} />
        <Spike reduced={reduced} />
        <MapBreach reduced={reduced} />
        <Agents />
        <Intel reduced={reduced} />
        <Finale reduced={reduced} />
      </main>
    </div>
  )
}
