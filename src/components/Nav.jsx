import { SECTIONS } from '../data/config'
import { goTo } from '../hooks/hooks'
import logo from '../assets/logo.svg'
export default function Nav({ active }) {
  return (<>
    <header className="nav">
      <button className="brand" onClick={() => goTo('hero')} aria-label="Protocol Zero, back to top">
  <img src={logo} alt="" width="28" height="28" /> PROTOCOL//ZERO
</button>
      <nav className="nav-links" aria-label="Sections">
        {SECTIONS.slice(1).map((s) => <button key={s.id} onClick={() => goTo(s.id)} aria-current={SECTIONS[active].id === s.id}>{s.label}</button>)}
      </nav>
    </header>
    <nav className="dots" aria-label="Section navigator">
      {SECTIONS.map((s, i) => <button key={s.id} onClick={() => goTo(s.id)} aria-label={`Go to ${s.label}`} aria-current={i === active} />)}
    </nav>
  </>)
}
