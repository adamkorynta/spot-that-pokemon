// Hard-coded pokedex index so we don't have to hit PokéAPI just to know which
// IDs belong to which generation / legendary / mythical bucket. These ranges
// are intentionally limited to the canonical national-dex ranges (no forms).

export const GENERATIONS = [
  { id: 1, label: 'Gen 1 — Kanto',    range: [1, 151],    region: 'Kanto'   },
  { id: 2, label: 'Gen 2 — Johto',    range: [152, 251],  region: 'Johto'   },
  { id: 3, label: 'Gen 3 — Hoenn',    range: [252, 386],  region: 'Hoenn'   },
  { id: 4, label: 'Gen 4 — Sinnoh',   range: [387, 493],  region: 'Sinnoh'  },
  { id: 5, label: 'Gen 5 — Unova',    range: [494, 649],  region: 'Unova'   },
  { id: 6, label: 'Gen 6 — Kalos',    range: [650, 721],  region: 'Kalos'   },
  { id: 7, label: 'Gen 7 — Alola',    range: [722, 809],  region: 'Alola'   },
  { id: 8, label: 'Gen 8 — Galar',    range: [810, 905],  region: 'Galar'   },
  { id: 9, label: 'Gen 9 — Paldea',   range: [906, 1025], region: 'Paldea'  },
]

export const TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
]

// Curated lists. Kept compact — covers the iconic legendaries across all gens.
export const LEGENDARY_IDS = new Set([
  // Gen 1
  144, 145, 146, 150,
  // Gen 2
  243, 244, 245, 249, 250,
  // Gen 3
  377, 378, 379, 380, 381, 382, 383, 384,
  // Gen 4
  480, 481, 482, 483, 484, 485, 486, 487, 488,
  // Gen 5
  638, 639, 640, 641, 642, 643, 644, 645, 646,
  // Gen 6
  716, 717, 718,
  // Gen 7
  772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 800,
  // Gen 8
  888, 889, 890, 891, 892, 894, 895, 896, 897, 898,
  // Gen 9
  1001, 1002, 1003, 1004, 1007, 1008, 1014, 1015, 1016, 1017,
])

export const MYTHICAL_IDS = new Set([
  151, 251, 385, 386, 489, 490, 491, 492, 493,
  494, 647, 648, 649, 719, 720, 721,
  801, 802, 807, 808, 809, 893,
])

export const ALL_IDS = (() => {
  const ids = []
  for (let i = 1; i <= 1025; i++) ids.push(i)
  return ids
})()

export function getGenerationForId(id) {
  return GENERATIONS.find(g => id >= g.range[0] && id <= g.range[1])
}

export function isLegendary(id) { return LEGENDARY_IDS.has(id) }
export function isMythical(id)  { return MYTHICAL_IDS.has(id) }
export function isNormalDex(id) { return !isLegendary(id) && !isMythical(id) }
