// Builds a candidate ID pool based on filter selections.
//
// We resolve "type" filters using PokéAPI's /type/{name} endpoint. Results
// are cached forever in localStorage, so this is fast after first visit.

import {
  GENERATIONS, LEGENDARY_IDS, MYTHICAL_IDS, isLegendary, isMythical,
} from '../data/pokedexIndex.js'

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

const memCache = new Map()

async function fetchJson(path) {
  if (memCache.has(path)) return memCache.get(path)
  const cached = lsGet(path)
  if (cached) { memCache.set(path, cached); return cached }
  const res = await fetch(BASE + path)
  if (!res.ok) throw new Error(`PokéAPI ${path} → ${res.status}`)
  const data = await res.json()
  memCache.set(path, data)
  lsSet(path, data)
  return data
}

// All non-form national-dex IDs (1..1025). PokéAPI uses higher ids for forms.
const MAX_ID = 1025

function rangeForGens(gens) {
  if (!gens || !gens.length) {
    return { from: 1, to: MAX_ID }
  }
  const picked = GENERATIONS.filter(g => gens.includes(g.id))
  return picked
}

export async function buildCandidatePool(filters) {
  const { generations = [], types = [], category = 'any' } = filters

  // 1. Base set from generation filter.
  let base = new Set()
  const gens = generations.length ? GENERATIONS.filter(g => generations.includes(g.id)) : GENERATIONS
  for (const g of gens) {
    for (let i = g.range[0]; i <= g.range[1]; i++) base.add(i)
  }

  // 2. Intersect with type filter (union of selected types).
  if (types.length) {
    const typeSets = await Promise.all(types.map(async (t) => {
      const data = await fetchJson(`/type/${t}`)
      const ids = new Set()
      for (const entry of (data.pokemon ?? [])) {
        const url = entry.pokemon?.url ?? ''
        const m = url.match(/\/pokemon\/(\d+)\//)
        if (m) {
          const id = Number(m[1])
          if (id <= MAX_ID) ids.add(id)
        }
      }
      return ids
    }))
    const typeUnion = new Set()
    for (const s of typeSets) for (const id of s) typeUnion.add(id)
    base = new Set([...base].filter(id => typeUnion.has(id)))
  }

  // 3. Category filter.
  if (category === 'legendary') base = new Set([...base].filter(id => LEGENDARY_IDS.has(id)))
  else if (category === 'mythical') base = new Set([...base].filter(id => MYTHICAL_IDS.has(id)))
  else if (category === 'normal') base = new Set([...base].filter(id => !LEGENDARY_IDS.has(id) && !MYTHICAL_IDS.has(id)))

  return [...base].sort((a, b) => a - b)
}
