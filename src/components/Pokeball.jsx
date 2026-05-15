// Reusable Pokéball SVG component — picks a design based on the Pokémon's
// type, rarity, and evolution stage. Used in the catch animation, the
// results modal, and the caught-gallery tiles.

import { useId } from 'react'

// ---------- Ball designs ----------
// Each design renders the top half color + optional accent shapes drawn
// inside the same clipPath as the top half (so they stay rounded).
const BALL_DESIGNS = {
  poke: {
    name: 'Poké Ball',
    topColor: '#ee1515',
  },
  great: {
    name: 'Great Ball',
    topColor: '#0a76c4',
    accents: () => (
      <path d="M 14 22 L 50 38 L 86 22" stroke="#ee1515" strokeWidth="3.2"
            fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  ultra: {
    name: 'Ultra Ball',
    topColor: '#1c1c1c',
    accents: () => (
      <g stroke="#f7d02c" strokeWidth="3.2" fill="none" strokeLinecap="round">
        <path d="M 22 18 L 30 40" />
        <path d="M 30 18 L 22 40" />
        <path d="M 70 18 L 78 40" />
        <path d="M 78 18 L 70 40" />
      </g>
    ),
  },
  master: {
    name: 'Master Ball',
    topColor: '#a23ec8',
    accents: () => (
      <>
        <text x="50" y="36" textAnchor="middle" fill="#fff"
              fontSize="22" fontWeight="900" fontFamily="sans-serif">M</text>
        <circle cx="28" cy="20" r="4.5" fill="#ff85cb" stroke="#fff" strokeWidth="1.5" />
        <circle cx="72" cy="20" r="4.5" fill="#ff85cb" stroke="#fff" strokeWidth="1.5" />
      </>
    ),
  },
  cherish: {
    name: 'Cherish Ball',
    topColor: '#c61b2f',
    accents: () => (
      <>
        {/* Gold ribbon stripe with center bow */}
        <path d="M 10 30 L 90 30" stroke="#f7d02c" strokeWidth="3.5" />
        <path d="M 36 22 L 50 30 L 36 38 Z" fill="#f7d02c" />
        <path d="M 64 22 L 50 30 L 64 38 Z" fill="#f7d02c" />
        <circle cx="50" cy="30" r="5" fill="#f7d02c" stroke="#222" strokeWidth="1.5" />
      </>
    ),
  },
  premier: {
    name: 'Premier Ball',
    topColor: '#ffffff',
    accents: () => (
      <circle cx="50" cy="50" r="46" stroke="#ee1515" strokeWidth="2.5" fill="none" />
    ),
  },
  net: {
    name: 'Net Ball',
    topColor: '#3fbdb4',
    accents: () => (
      <g stroke="#ffffff" strokeWidth="1.6" opacity="0.92">
        <line x1="20" y1="12" x2="40" y2="44" />
        <line x1="40" y1="12" x2="60" y2="44" />
        <line x1="60" y1="12" x2="80" y2="44" />
        <line x1="80" y1="12" x2="60" y2="44" />
        <line x1="60" y1="12" x2="40" y2="44" />
        <line x1="40" y1="12" x2="20" y2="44" />
      </g>
    ),
  },
  dive: {
    name: 'Dive Ball',
    topColor: '#3aa4d0',
    accents: () => (
      <>
        <path d="M 12 26 Q 22 18 32 26 T 52 26 T 72 26 T 92 26"
              stroke="#ffffff" strokeWidth="2.6" fill="none" />
        <path d="M 12 36 Q 22 28 32 36 T 52 36 T 72 36 T 92 36"
              stroke="#ffffff" strokeWidth="1.6" fill="none" opacity="0.6" />
      </>
    ),
  },
  dusk: {
    name: 'Dusk Ball',
    topColor: '#1f5c3e',
    accents: () => (
      <path d="M 50 14 a 12 12 0 1 0 0 24 a 9 9 0 1 1 0 -24 z" fill="#f7d02c" />
    ),
  },
  quick: {
    name: 'Quick Ball',
    topColor: '#3aa4d0',
    accents: () => (
      <>
        <rect x="0" y="20" width="100" height="8" fill="#f7d02c" />
        <rect x="0" y="34" width="100" height="6" fill="#f7d02c" />
      </>
    ),
  },
  moon: {
    name: 'Moon Ball',
    topColor: '#fff5e0',
    accents: () => (
      <path d="M 50 14 a 12 12 0 1 0 0 24 a 9 9 0 1 1 0 -24 z"
            fill="#ffb942" stroke="#222" strokeWidth="1.5" />
    ),
  },
  luxury: {
    name: 'Luxury Ball',
    topColor: '#1a1a1a',
    accents: () => (
      <>
        <path d="M 10 44 A 40 40 0 0 1 90 44" stroke="#d4a017" strokeWidth="2.5" fill="none" />
        <circle cx="50" cy="22" r="4" fill="#ee1515" />
        <circle cx="28" cy="34" r="3" fill="#ee1515" />
        <circle cx="72" cy="34" r="3" fill="#ee1515" />
      </>
    ),
  },
  dream: {
    name: 'Dream Ball',
    topColor: '#f4abd2',
    accents: () => (
      <g fill="#ffffff">
        <circle cx="50" cy="22" r="3" />
        <circle cx="32" cy="32" r="2" opacity="0.85" />
        <circle cx="68" cy="32" r="2" opacity="0.85" />
        <circle cx="40" cy="18" r="1.6" opacity="0.7" />
        <circle cx="60" cy="18" r="1.6" opacity="0.7" />
        <circle cx="50" cy="38" r="1.8" opacity="0.6" />
      </g>
    ),
  },
  nest: {
    name: 'Nest Ball',
    topColor: '#aade65',
    accents: () => (
      <>
        <path d="M 18 38 Q 28 22 50 28 Q 48 36 32 40 Z" fill="#5d9931" opacity="0.95" />
        <path d="M 82 38 Q 72 22 50 28 Q 52 36 68 40 Z" fill="#5d9931" opacity="0.95" />
      </>
    ),
  },
  heavy: {
    name: 'Heavy Ball',
    topColor: '#5e6878',
    accents: () => (
      <>
        <circle cx="20" cy="26" r="4.5" fill="#2c333d" />
        <circle cx="80" cy="26" r="4.5" fill="#2c333d" />
        <line x1="14" y1="34" x2="86" y2="34" stroke="#3a4250" strokeWidth="1.5" />
      </>
    ),
  },
  fast: {
    name: 'Fast Ball',
    topColor: '#f3c84b',
    accents: () => (
      <g stroke="#ee1515" strokeWidth="2.6" strokeLinecap="round">
        <line x1="14" y1="18" x2="38" y2="18" />
        <line x1="14" y1="28" x2="50" y2="28" />
        <line x1="14" y1="38" x2="32" y2="38" />
      </g>
    ),
  },
}

// ---------- Ball selection logic ----------
// Priority order: rarity > primary-type specialty > evolution stage.
// This mirrors how a player would actually reach for a ball — Master/
// Cherish for legendary/mythical first, then a type-appropriate ball,
// then fall back to a generic ball sized to the stage.
export function pickBallType({ types = [], evolutionStage, isLegendary, isMythical } = {}) {
  if (isMythical)  return 'cherish'
  if (isLegendary) return 'master'

  const t = new Set(types)
  if (t.has('water'))    return 'dive'
  if (t.has('bug'))      return 'net'
  if (t.has('ghost'))    return 'dusk'
  if (t.has('dark'))     return 'dusk'
  if (t.has('electric')) return 'quick'
  if (t.has('fairy'))    return 'moon'
  if (t.has('dragon'))   return 'luxury'
  if (t.has('psychic'))  return 'dream'
  if (t.has('grass'))    return 'nest'
  if (t.has('rock'))     return 'heavy'
  if (t.has('steel'))    return 'heavy'
  if (t.has('ground'))   return 'heavy'
  if (t.has('fighting')) return 'heavy'
  if (t.has('flying'))   return 'fast'
  if (t.has('ice'))      return 'premier'

  if (evolutionStage === 'Final evolution')  return 'ultra'
  if (evolutionStage === 'Middle evolution') return 'great'
  return 'poke'
}

export function ballName(type) {
  return (BALL_DESIGNS[type] || BALL_DESIGNS.poke).name
}

// ---------- Component ----------
export default function Pokeball({ type = 'poke', className = '', title }) {
  const ball = BALL_DESIGNS[type] || BALL_DESIGNS.poke
  const reactId = useId().replace(/:/g, '')   // useId returns colons which look weird in CSS selectors
  const clipId = `pbclip-${reactId}`

  return (
    <svg
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title || ball.name}
    >
      <defs>
        <clipPath id={clipId}><circle cx="50" cy="50" r="46" /></clipPath>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#fff" stroke="#222" strokeWidth="5" />
      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="100" height="50" fill={ball.topColor} />
        {ball.accents && ball.accents()}
      </g>
      <rect x="0" y="45" width="100" height="10" fill="#222" />
      <circle cx="50" cy="50" r="14" fill="#fff" stroke="#222" strokeWidth="5" />
      <circle cx="50" cy="50" r="6" fill="#fff" stroke="#222" strokeWidth="3" />
    </svg>
  )
}
