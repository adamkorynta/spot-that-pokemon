// Thin, cached wrapper over PokéAPI. Everything is GET, so we cache aggressively
// in module-level Maps. Also persists to localStorage so reloads stay snappy.

const BASE = 'https://pokeapi.co/api/v2'

const LS_PREFIX = 'stp-cache:v1:'

function lsGet(key) {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
function lsSet(key, value) {
  try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(value)) } catch {}
}

const memoryCache = new Map()

async function fetchJson(path) {
  if (memoryCache.has(path)) return memoryCache.get(path)
  const cached = lsGet(path)
  if (cached) {
    memoryCache.set(path, cached)
    return cached
  }
  const res = await fetch(BASE + path)
  if (!res.ok) throw new Error(`PokéAPI ${path} → ${res.status}`)
  const json = await res.json()
  memoryCache.set(path, json)
  lsSet(path, json)
  return json
}

// ---------- Public API ----------

export async function getPokemon(id)        { return fetchJson(`/pokemon/${id}`) }
export async function getPokemonSpecies(id) { return fetchJson(`/pokemon-species/${id}`) }
export async function getEvolutionChain(url) {
  // url is already a full URL; strip the base.
  const path = url.replace('https://pokeapi.co/api/v2', '')
  return fetchJson(path)
}

export function spriteUrl(id) {
  // Official artwork — high res and consistent across all gens.
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}
export function spriteFallbackUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

// ---------- Higher-level helpers ----------

// Returns a clean, child-friendly flavor text with the Pokémon's name redacted.
export function pickFlavorText(species) {
  if (!species?.flavor_text_entries) return null
  const english = species.flavor_text_entries.filter(e => e.language?.name === 'en')
  if (!english.length) return null
  // Prefer entries from "newer" games — they tend to be cleaner and shorter.
  const preferredOrder = [
    'scarlet', 'violet', 'shield', 'sword', 'lets-go-pikachu', 'lets-go-eevee',
    'sun', 'moon', 'x', 'y', 'omega-ruby', 'alpha-sapphire',
    'black', 'white', 'platinum', 'heartgold', 'soulsilver',
    'ruby', 'sapphire', 'emerald', 'gold', 'silver', 'crystal', 'red', 'blue', 'yellow',
  ]
  const sorted = [...english].sort((a, b) => {
    const ai = preferredOrder.indexOf(a.version?.name ?? '')
    const bi = preferredOrder.indexOf(b.version?.name ?? '')
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })
  const entry = sorted[0]
  const cleaned = entry.flavor_text.replace(/\f|\n|\r|­/g, ' ').replace(/\s+/g, ' ').trim()
  return redactName(cleaned, species.name)
}

export function redactName(text, name) {
  if (!text || !name) return text
  // Redact the species name AND its uppercase variant (older flavor text uses ALLCAPS).
  const pattern = new RegExp(`\\b${escapeRegex(name)}\\b`, 'gi')
  return text.replace(pattern, '?????')
}

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

export function deriveEvolutionStage(chain, name) {
  // 1 = baby/base, 2 = mid, 3 = final.
  function walk(node, depth) {
    if (!node) return null
    if (node.species?.name === name) return depth
    for (const child of (node.evolves_to ?? [])) {
      const res = walk(child, depth + 1)
      if (res) return res
    }
    return null
  }
  const depth = walk(chain.chain, 1)
  if (!depth) return null
  // figure out max depth of the chain
  function maxDepth(node) {
    if (!node) return 0
    let m = 1
    for (const c of (node.evolves_to ?? [])) m = Math.max(m, 1 + maxDepth(c))
    return m
  }
  const total = maxDepth(chain.chain)
  if (total === 1) return 'Standalone (no evolutions)'
  if (depth === 1) return 'Base form'
  if (depth === total) return 'Final evolution'
  return 'Middle evolution'
}

export function formatHeight(decimetres) {
  // PokéAPI height is in decimetres.
  const meters = decimetres / 10
  const totalInches = meters * 39.3701
  const feet = Math.floor(totalInches / 12)
  const inches = Math.round(totalInches - feet * 12)
  return `${meters.toFixed(1)} m  •  ${feet}' ${inches}"`
}

export function formatWeight(hectograms) {
  // PokéAPI weight is in hectograms.
  const kg = hectograms / 10
  const lb = kg * 2.20462
  return `${kg.toFixed(1)} kg  •  ${lb.toFixed(1)} lb`
}
