import { SECTIONS } from '../data/config'
import { goTo } from '../hooks/hooks'
export default function Nav({ active }) {
  return (<>
    <header className="nav">
      <button className="brand" onClick={() => goTo('hero')} aria-label="Protocol Zero, back to top">PROTOCOL//ZERO</button>
      <nav className="nav-links" aria-label="Sections">
        {SECTIONS.slice(1).map((s) => <button key={s.id} onClick={() => goTo(s.id)} aria-current={SECTIONS[active].id === s.id}>{s.label}</button>)}
      </nav>
    </header>
    <nav className="dots" aria-label="Section navigator">
      {SECTIONS.map((s, i) => <button key={s.id} onClick={() => goTo(s.id)} aria-label={`Go to ${s.label}`} aria-current={i === active} />)}
    </nav>
  </>)
}
