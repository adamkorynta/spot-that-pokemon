import { GENERATIONS, TYPES } from '../data/pokedexIndex.js'
import { capitalize } from '../utils/helpers.js'

export default function FilterPanel({
  filters, difficulty, muted, pool, loading, error,
  onChangeFilters, onChangeDifficulty, onToggleMute, onStart,
}) {
  const toggleGen = (id) => {
    const next = filters.generations.includes(id)
      ? filters.generations.filter(g => g !== id)
      : [...filters.generations, id]
    onChangeFilters({ ...filters, generations: next })
  }
  const toggleType = (t) => {
    const next = filters.types.includes(t)
      ? filters.types.filter(x => x !== t)
      : [...filters.types, t]
    onChangeFilters({ ...filters, types: next })
  }
  const setCategory = (cat) => onChangeFilters({ ...filters, category: cat })

  const allGens = () => onChangeFilters({ ...filters, generations: GENERATIONS.map(g => g.id) })
  const clearGens = () => onChangeFilters({ ...filters, generations: [] })
  const clearTypes = () => onChangeFilters({ ...filters, types: [] })

  return (
    <div className="poke-panel p-3 p-md-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
        <h2 className="h4 m-0 fw-bold">
          <i className="bi bi-funnel-fill text-danger me-2" />
          Pick your Pokédex
        </h2>
        <span className="badge text-bg-dark fs-6" aria-live="polite">
          {loading ? '…loading' : `${pool.length} Pokémon in pool`}
        </span>
      </div>

      {/* Generation filter */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="muted-label">Generation</span>
          <div className="btn-group btn-group-sm" role="group" aria-label="Generation quick actions">
            <button className="btn btn-outline-dark" onClick={allGens} type="button">All</button>
            <button className="btn btn-outline-dark" onClick={clearGens} type="button">None</button>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {GENERATIONS.map(g => {
            const active = filters.generations.includes(g.id)
            return (
              <button
                key={g.id}
                type="button"
                className={`btn ${active ? 'btn-poke-red' : 'btn-outline-dark'} btn-sm`}
                aria-pressed={active}
                onClick={() => toggleGen(g.id)}
              >
                Gen {g.id}
                <span className="ms-2 small fw-normal opacity-75">{g.region}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Type filter */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="muted-label">Type (optional)</span>
          <button className="btn btn-outline-dark btn-sm" type="button" onClick={clearTypes}>Clear</button>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {TYPES.map(t => {
            const active = filters.types.includes(t)
            return (
              <button
                key={t}
                type="button"
                aria-pressed={active}
                className={`type-badge border-0 ${active ? '' : 'opacity-50'} type-${t}`}
                style={{ cursor: 'pointer', padding: '0.35rem 0.85rem' }}
                onClick={() => toggleType(t)}
              >
                {capitalize(t)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Category */}
      <div className="mb-4">
        <span className="muted-label d-block mb-2">Pokédex category</span>
        <div className="d-flex flex-wrap gap-2">
          {[
            { value: 'any',       label: 'Any' },
            { value: 'normal',    label: 'Normal only' },
            { value: 'legendary', label: 'Legendary only' },
            { value: 'mythical',  label: 'Mythical only' },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`btn btn-sm ${filters.category === opt.value ? 'btn-poke-blue' : 'btn-outline-dark'}`}
              aria-pressed={filters.category === opt.value}
              onClick={() => setCategory(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="mb-4">
        <span className="muted-label d-block mb-2">Difficulty</span>
        <div className="d-flex flex-wrap gap-2" role="radiogroup" aria-label="Difficulty">
          {[
            { value: 'easy', label: 'Easy', help: 'Obvious clues, 6 hints' },
            { value: 'hard', label: 'Hard', help: 'Pokédex first, 4 hints' },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={difficulty === opt.value}
              className={`btn ${difficulty === opt.value ? 'btn-poke-red' : 'btn-outline-dark'} btn-sm`}
              onClick={() => onChangeDifficulty(opt.value)}
              title={opt.help}
            >
              <i className={`bi ${opt.value === 'easy' ? 'bi-emoji-smile' : 'bi-fire'} me-1`} />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          Could not load Pokémon: {error}
        </div>
      )}

      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
        <button
          className="btn btn-poke btn-lg flex-grow-1"
          type="button"
          onClick={onStart}
          disabled={loading || !pool.length}
        >
          <i className="bi bi-play-circle-fill me-2" />
          Start the round
        </button>
        <button
          className="btn btn-outline-dark"
          type="button"
          onClick={onToggleMute}
          aria-pressed={muted}
          title={muted ? 'Sound off — click to enable' : 'Sound on — click to mute'}
        >
          <i className={`bi ${muted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'}`} />
        </button>
      </div>
    </div>
  )
}
