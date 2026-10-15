import vesper from '../assets/agents/viper.jpg'
import kestrel from '../assets/agents/chamber.jpg'
import rook from '../assets/agents/fase.jpg'
import cinder from '../assets/agents/reyna.jpg'

// Central config: palette, asset URLs, fictional agents and missions.
export const COLORS = { obsidian: '#0B0C10', red: '#FF4655', white: '#F4F4F2', slate: '#20232C', grey: '#9297A3' }

// Everything is procedural by default. Set a URL here to override (see ASSETS.md).
// agentPortraits example (files in src/assets/agents/, import them at the top of this file):
//   import vBack from '../assets/agents/vesper-back.webp'
//   import vBody from '../assets/agents/vesper-body.webp'
//   agentPortraits: { vesper: [vBack, vBody] }   // back to front; or [{ src: vBody, depth: 1 }]
export const ASSETS = {
  spikeModel: null,
  agentPortraits: { vesper, kestrel, rook, cinder },
}

// Spike colors: edit these to retint the device. Near-black body, red glow.
export const SPIKE_COLORS = { body: '#121317', trim: '#3B3E47', glow: '#FF4655', glass: '#FF4655' }

export const SECTIONS = [
  { id: 'hero', label: 'Boot' }, { id: 'spike', label: 'Spike' }, { id: 'map', label: 'Map' },
  { id: 'agents', label: 'Agents' }, { id: 'intel', label: 'Intel' }, { id: 'finale', label: 'Finale' },
]


// Original VALORANT characters.
export const AGENTS = [
  { id: 'vesper', name: 'VIPER', role: 'Controller', sides: 3, accent: '#FF4655', bio: 'Original placeholder. Shapes sightlines with drifting smoke-like fields.',
    abilities: [['Dusk Veil', 'Places a slow vision-blocking cloud.'], ['Low Tide', 'Pulls a short fog bank along a line.'], ['Blackout', 'Dims a wide area briefly.']] },
  { id: 'kestrel', name: 'CHAMBER', role: 'Initiator', sides: 4, accent: '#FF7683', bio: 'Original placeholder. Opens sites with scouting tools.',
    abilities: [['Ping Drone', 'Reveals enemies in a cone.'], ['Flare Dart', 'Bursts into a blinding flash.'], ['Overwatch', 'Marks a zone for the squad.']] },
  { id: 'rook', name: 'FADE', role: 'Sentinel', sides: 6, accent: '#F4F4F2', bio: 'Original placeholder. Locks down flanks and holds angles.',
    abilities: [['Tripline', 'Alerts when crossed.'], ['Bulwark', 'Raises a short barrier.'], ['Lockdown', 'Slows enemies in a radius.']] },
  { id: 'cinder', name: 'REYNA', role: 'Duelist', sides: 5, accent: '#C93A47', bio: 'Original placeholder. Fast entries and aggressive trades.',
    abilities: [['Spark Step', 'Dashes forward a short distance.'], ['Ember Wall', 'Creates a short burning wall.'], ['Flashpoint', 'Overcharges for a quick burst.']] },
]

export const SITES = [
  { id: 'A', name: 'Foundry Gate', coord: '41.20N / 12.70E', x: 24, y: 40, info: 'Wide entry with two heavy-cover lanes. Fictional site.' },
  { id: 'B', name: 'Relay Spine', coord: '41.22N / 12.74E', x: 52, y: 62, info: 'Narrow corridor with a raised catwalk. Fictional site.' },
  { id: 'C', name: 'Signal Yard', coord: '41.19N / 12.79E', x: 78, y: 34, info: 'Open yard with long sightlines. Fictional site.' },
]

export const ROUTES = [
  { id: 'r1', name: 'Foundry push', d: 'M40 210 L90 150 L150 140 L200 80', time: '0:42', risk: 72, progress: 64 },
  { id: 'r2', name: 'Spine split', d: 'M40 210 L110 190 L190 170 L250 190', time: '0:55', risk: 48, progress: 81 },
  { id: 'r3', name: 'Yard flank', d: 'M40 210 L70 120 L160 60 L270 50', time: '1:08', risk: 35, progress: 52 },
]
export const COUNTERS = [['Rounds simulated', 12840], ['Routes scored', 3096], ['Squads online', 24]]
export const SQUAD = ['SQ-01', 'SQ-02', 'SQ-03', 'SQ-04']
