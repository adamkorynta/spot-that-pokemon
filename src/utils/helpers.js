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
