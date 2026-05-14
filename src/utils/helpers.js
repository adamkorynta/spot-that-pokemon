// Misc helpers used across the app.

export function shuffle(arr) {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function take(arr, n) {
  return shuffle(arr).slice(0, n)
}

export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Pretty pokémon name: handle hyphens and casing.
export function prettyName(name) {
  if (!name) return ''
  return name
    .split('-')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}

export function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n))
}

// Canonical "type chart" colors used by the type badges, plus a single
// helper for resolving a primary-type color (used to subtly theme the
// background per round).
export const TYPE_COLORS = {
  normal:   '#A8A77A',
  fire:     '#EE8130',
  water:    '#6390F0',
  electric: '#F7D02C',
  grass:    '#7AC74C',
  ice:      '#96D9D6',
  fighting: '#C22E28',
  poison:   '#A33EA1',
  ground:   '#E2BF65',
  flying:   '#A98FF3',
  psychic:  '#F95587',
  bug:      '#A6B91A',
  rock:     '#B6A136',
  ghost:    '#735797',
  dragon:   '#6F35FC',
  dark:     '#705746',
  steel:    '#B7B7CE',
  fairy:    '#D685AD',
}

export function typeColor(type) {
  return TYPE_COLORS[type] || '#3b4cca'
}
