import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getPokemon, getPokemonSpecies, getEvolutionChain,
  pickFlavorText, deriveEvolutionStage, formatHeight, formatWeight,
} from '../services/pokeapi.js'
import { buildCandidatePool } from '../services/pool.js'
import { getGenerationForId, isLegendary, isMythical } from '../data/pokedexIndex.js'
import { randomFrom, shuffle, prettyName } from '../utils/helpers.js'
import { sfx } from '../utils/audio.js'
import { pickBallType } from '../components/Pokeball.jsx'

const TOTAL_HINTS_EASY = 6
const TOTAL_HINTS_HARD = 4
const MAX_BLUR_PX = 20
const MIN_BLUR_PX = 0
const POINTS_START = 200
const POINTS_PER_WRONG = 12
const POINTS_PER_HINT = 8

// Map a "guesses used" count to a CSS blur. Starts at MAX (0 wrong guesses)
// and hits 0 on the LAST allowed guess — i.e. wrong-count = totalHints - 1.
// The next wrong guess triggers runaway, so the player effectively sees the
// silhouette completely sharp on their final attempt.
function blurFor(guessesUsed, totalHints) {
  const denom = Math.max(1, totalHints - 1)
  const t = Math.min(1, guessesUsed / denom)
  return Math.round(MAX_BLUR_PX - (MAX_BLUR_PX - MIN_BLUR_PX) * t)
}

export function useGame() {
  const [filters, setFilters] = useState({
    generations: [1],          // start with Gen 1 — friendliest
    types: [],
    category: 'normal',         // hide legendaries by default
  })
  const [difficulty, setDifficulty] = useState('easy') // 'easy' | 'hard'
  const [muted, setMutedState] = useState(false)

  const [pool, setPool] = useState([])             // candidate IDs
  const [seenIds, setSeenIds] = useState(new Set()) // avoid duplicates within session

  const [round, setRound] = useState(null)
  /* round shape: {
       id, name, prettyName, sprite, types, height, weight, abilities,
       evolutionStage, generation, region, flavor,
       choices: { id, name }[],   // 24 entries (1 correct + 23 distractors)
       guesses: string[],         // names attempted
       revealedHints: number,
       solved: boolean,
       gaveUp: boolean,
       catchAnimating: boolean,   // true while Pokéball catch animation is playing
       score: number,
     }
  */

  // Caught Pokémon for this session (cleared on resetGame).
  const [caught, setCaught] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(() => {
    try { return Number(localStorage.getItem('stp-best-streak') || 0) } catch { return 0 }
  })
  const [roundsPlayed, setRoundsPlayed] = useState(0)
  const [roundsWon, setRoundsWon] = useState(0)

  const totalHints = difficulty === 'hard' ? TOTAL_HINTS_HARD : TOTAL_HINTS_EASY

  // Sync audio mute state.
  useEffect(() => { sfx.setMuted(muted) }, [muted])

  // Persist best streak.
  useEffect(() => {
    try { localStorage.setItem('stp-best-streak', String(bestStreak)) } catch {}
  }, [bestStreak])

  // Build the pool whenever filters change.
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    buildCandidatePool(filters)
      .then(ids => { if (!cancelled) { setPool(ids); setSeenIds(new Set()) } })
      .catch(err => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [filters])

  // Build the hint pipeline for the chosen difficulty. The first entry is
  // ALWAYS the redacted Pokédex entry — it's visible from the start of every
  // round. Subsequent entries unlock one per wrong guess.
  function buildHintPipeline(data) {
    const flavorHint = {
      kind: 'flavor',
      label: 'Pokédex entry',
      value: data.flavor || 'No Pokédex entry on file.',
    }
    const easy = [
      flavorHint,
      { kind: 'types',      label: 'Type',           value: data.types },
      { kind: 'generation', label: 'Generation',     value: `Gen ${data.generation.id} — ${data.region}` },
      { kind: 'evolution',  label: 'Evolution stage', value: data.evolutionStage || 'Unknown' },
      { kind: 'sizing',     label: 'Size',           value: `Height ${data.height} • Weight ${data.weight}` },
      { kind: 'ability',    label: 'Ability',        value: data.abilities[0] ? prettyName(data.abilities[0]) : 'Unknown' },
    ]
    if (difficulty === 'easy') return easy

    // Hard mode: fewer follow-up hints, tougher order.
    return [
      flavorHint,
      { kind: 'ability',    label: 'Ability',         value: data.abilities[0] ? prettyName(data.abilities[0]) : 'Unknown' },
      { kind: 'evolution',  label: 'Evolution stage', value: data.evolutionStage || 'Unknown' },
      { kind: 'types',      label: 'Type',            value: data.types },
    ]
  }

  const buildChoices = useCallback(async (correctId, correctName) => {
    // Distractors come from the same filter pool so they're believable.
    // If the pool is too small (<32), widen with a broader fallback so we
    // can always fill 25 choices.
    const base = pool.filter(id => id !== correctId)
    const FALLBACK_RANGE = []
    if (base.length < 32) {
      for (let i = 1; i <= 1025; i++) if (i !== correctId && !base.includes(i)) FALLBACK_RANGE.push(i)
    }

    // Pick ~36 ids in parallel (some may fail or duplicate-name); we need 24
    // unique distractors so the +1 correct answer fills exactly 25 buttons.
    const TARGET_FETCH = 36
    const primary  = shuffle(base).slice(0, Math.min(TARGET_FETCH, base.length))
    const filler   = shuffle(FALLBACK_RANGE).slice(0, TARGET_FETCH - primary.length)
    const ids      = [...primary, ...filler]

    const results = await Promise.allSettled(
      ids.map(id => getPokemon(id).then(p => ({ id, name: prettyName(p.name) })))
    )
    const picks = []
    const seenNames = new Set([prettyName(correctName)])
    for (const r of results) {
      if (r.status !== 'fulfilled') continue
      const { id, name } = r.value
      if (seenNames.has(name)) continue
      seenNames.add(name)
      picks.push({ id, name })
      if (picks.length >= 24) break
    }
    return shuffle([{ id: correctId, name: prettyName(correctName) }, ...picks])
  }, [pool])

  const startRound = useCallback(async () => {
    if (!pool.length) return
    setLoading(true)
    setError(null)
    try {
      // Pick an ID not yet seen this session (reset when exhausted).
      const remaining = pool.filter(id => !seenIds.has(id))
      const candidates = remaining.length ? remaining : pool
      const id = randomFrom(candidates)
      const newSeen = new Set(seenIds)
      newSeen.add(id)
      setSeenIds(newSeen)

      const [pokemon, species] = await Promise.all([
        getPokemon(id),
        getPokemonSpecies(id),
      ])
      let evolutionStage = null
      try {
        if (species.evolution_chain?.url) {
          const chain = await getEvolutionChain(species.evolution_chain.url)
          evolutionStage = deriveEvolutionStage(chain, pokemon.name)
        }
      } catch { /* evolution chain optional */ }

      const generation = getGenerationForId(id) ?? { id: '?', region: 'Unknown' }
      const types = pokemon.types?.map(t => t.type.name) ?? []
      const abilities = (pokemon.abilities ?? []).filter(a => !a.is_hidden).map(a => a.ability.name)
      if (!abilities.length && pokemon.abilities?.length) abilities.push(pokemon.abilities[0].ability.name)
      const flavor = pickFlavorText(species)

      const legendaryFlag = isLegendary(id)
      const mythicalFlag  = isMythical(id)

      const data = {
        id,
        name: pokemon.name,
        prettyName: prettyName(pokemon.name),
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        spriteFallback: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        types,
        abilities,
        height: formatHeight(pokemon.height),
        weight: formatWeight(pokemon.weight),
        evolutionStage,
        generation,
        region: generation.region,
        flavor,
        isLegendary: legendaryFlag,
        isMythical:  mythicalFlag,
        // Pre-compute the ball this Pokémon "wants" to be caught in.
        ballType: pickBallType({
          types,
          evolutionStage,
          isLegendary: legendaryFlag,
          isMythical:  mythicalFlag,
        }),
      }

      const hintPipeline = buildHintPipeline(data)
      const choices = await buildChoices(id, pokemon.name)

      setRound({
        ...data,
        hintPipeline,
        choices,
        guesses: [],
        wrongChoices: [],
        // First hint (Pokédex entry) is always shown for free.
        revealedHints: 1,
        solved: false,
        gaveUp: false,
        roundScore: null,
      })
      sfx.start()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Unable to start a round.')
    } finally {
      setLoading(false)
    }
  }, [pool, seenIds, difficulty, buildChoices])

  const guess = useCallback((choice) => {
    if (!round || round.solved || round.gaveUp || round.ranAway) return
    if (round.wrongChoices.includes(choice)) return
    if (choice === round.prettyName) {
      // Correct! The first hint is free — only count hints beyond it.
      const extraHints = Math.max(0, round.revealedHints - 1)
      const pointsLost = round.wrongChoices.length * POINTS_PER_WRONG + extraHints * POINTS_PER_HINT
      const roundScore = Math.max(20, POINTS_START - pointsLost)
      setRound(r => ({
        ...r,
        solved: true,
        catchAnimating: true,        // play Pokéball catch animation
        roundScore,
        guesses: [...r.guesses, choice],
      }))
      setScore(s => s + roundScore)
      setStreak(s => {
        const next = s + 1
        setBestStreak(b => Math.max(b, next))
        return next
      })
      setRoundsPlayed(n => n + 1)
      setRoundsWon(n => n + 1)
      // Record the catch in this session's gallery.
      setCaught(c => [
        ...c,
        {
          id: round.id,
          name: round.name,
          prettyName: round.prettyName,
          sprite: round.sprite,
          spriteFallback: round.spriteFallback,
          types: round.types,
          roundScore,
          ballType: round.ballType,
        },
      ])
      sfx.correct()
      setTimeout(() => sfx.reveal(), 250)
      // Wait for the full catch sequence: throw 0.55s → wiggle ×3 ≈ 1.35s →
      // click flash 0.5s → fireworks finale (~3.85s end). Slight clip on the
      // tail of the last firework's fade is fine.
      setTimeout(() => {
        setRound(r => (r && r.solved ? { ...r, catchAnimating: false } : r))
      }, 3700)
    } else {
      // Wrong.
      const nextWrongCount = round.wrongChoices.length + 1
      // The wrong-guesses bar fills at hintPipeline.length wrongs — that's
      // when the Pokémon runs away.
      const willRunAway = nextWrongCount >= round.hintPipeline.length

      setRound(r => {
        const nextWrong = [...r.wrongChoices, choice]
        const revealedHints = Math.min(1 + nextWrong.length, r.hintPipeline.length)
        return {
          ...r,
          wrongChoices: nextWrong,
          guesses: [...r.guesses, choice],
          revealedHints,
          ranAway: willRunAway,
        }
      })

      if (willRunAway) {
        setStreak(0)
        setRoundsPlayed(n => n + 1)
        sfx.wrong()
        setTimeout(() => sfx.runaway(), 300)
        // Auto-advance to next Pokémon once the flee animation finishes.
        setTimeout(() => { startRound() }, 2800)
      } else {
        sfx.wrong()
        setTimeout(() => sfx.hint(), 200)
      }
    }
  }, [round, startRound])

  const giveUp = useCallback(() => {
    if (!round || round.solved) return
    setRound(r => ({ ...r, gaveUp: true, roundScore: 0 }))
    setStreak(0)
    setRoundsPlayed(n => n + 1)
    sfx.reveal()
  }, [round])

  const resetGame = useCallback(() => {
    setScore(0); setStreak(0); setRoundsPlayed(0); setRoundsWon(0)
    setRound(null); setSeenIds(new Set()); setCaught([])
  }, [])

  // Drops the current round without touching score/streak/caught. Used when
  // the player jumps back to the filter panel mid-round (or from the results
  // modal) — also ensures the modal closes.
  const dismissRound = useCallback(() => {
    setRound(null)
  }, [])

  const blurPx = useMemo(() => {
    if (!round) return MAX_BLUR_PX
    if (round.solved || round.gaveUp) return 0
    return blurFor(round.wrongChoices.length, round.hintPipeline.length)
  }, [round])

  return {
    // state
    filters, difficulty, muted,
    pool, round, loading, error, caught,
    score, streak, bestStreak, roundsPlayed, roundsWon,
    blurPx, totalHints,
    // setters
    setFilters, setDifficulty,
    setMuted: setMutedState,
    // actions
    startRound, guess, giveUp, resetGame, dismissRound,
  }
}
