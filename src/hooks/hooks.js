import { useEffect, useState } from 'react'
const Q = '(prefers-reduced-motion: reduce)'
export function useReducedMotion() {
  const [r, setR] = useState(() => matchMedia(Q).matches)
  useEffect(() => { const m = matchMedia(Q); const f = () => setR(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f) }, [])
  return r
}
export function useWebGL() {
  return useState(() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false } })[0]
}
export function getQuality() {
  const w = innerWidth
  if (w < 700) return { particles: 500, dpr: 1, aa: false, bloom: false }
  if (w < 1100) return { particles: 900, dpr: 1.25, aa: false, bloom: true }
  return { particles: 1800, dpr: Math.min(devicePixelRatio, 2), aa: true, bloom: true }
}
export function goTo(id) {
  const el = document.getElementById(id); if (!el) return
  const t = el.parentElement.classList.contains('pin-spacer') ? el.parentElement : el
  t.scrollIntoView({ behavior: matchMedia(Q).matches ? 'auto' : 'smooth' })
}
