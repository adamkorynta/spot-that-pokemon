import { capitalize } from '../utils/helpers.js'

// One revealed hint as a compact pill chip.
function RevealedChip({ hint }) {
  if (hint.kind === 'types') {
    return (
      <span className="hint-chip">
        <span className="text-muted small">Type</span>
        {hint.value.map(t => (
          <span key={t} className={`type-badge type-${t}`}>{capitalize(t)}</span>
        ))}
      </span>
    )
  }
  if (hint.kind === 'flavor') return null  // rendered as its own block below
  return (
    <span className="hint-chip">
      <span className="text-muted small">{hint.label}</span>
      <strong>{hint.value}</strong>
    </span>
  )
}

// A "?" placeholder chip for a locked hint — shows the player what category
// of clue is coming without spoiling it. Keeps the panel height stable.
function LockedChip({ hint }) {
  if (hint.kind === 'flavor') return null  // flavor placeholder is the dashed block below
  return (
    <span className="hint-chip hint-chip-locked" title="Guess to reveal">
      <i className="bi bi-lock-fill" />
      <span className="text-muted small">{hint.label}</span>
    </span>
  )
}

export default function HintPanel({ round }) {
  if (!round) return null
  const revealed = round.hintPipeline.slice(0, round.revealedHints)
  const locked   = round.hintPipeline.slice(round.revealedHints)
  const flavorRevealed = revealed.find(h => h.kind === 'flavor')
  const flavorLocked   = locked.some(h => h.kind === 'flavor')

  return (
    <div className="poke-panel-yellow p-3">
      <h3 className="h6 mb-3 fw-bold">
        <i className="bi bi-lightbulb-fill text-warning me-2" />
        Hints ({round.revealedHints}/{round.hintPipeline.length})
      </h3>

      <div className="d-flex flex-wrap align-items-center mb-2">
        {revealed.map((h, i) => <RevealedChip key={`r-${i}`} hint={h} />)}
        {locked.map((h, i)   => <LockedChip   key={`l-${i}`} hint={h} />)}
      </div>

      {flavorRevealed && (
        <div className="hint-flavor mt-2">
          <span className="d-block muted-label mb-1">Pokédex entry</span>
          {flavorRevealed.value}
        </div>
      )}
      {!flavorRevealed && flavorLocked && (
        <div className="hint-flavor hint-flavor-locked mt-2" aria-hidden="true">
          <span className="d-block muted-label mb-1">
            <i className="bi bi-lock-fill me-1" />
            Pokédex entry
          </span>
          <span className="hint-flavor-redacted">?????? ?????? ?? ?????????? ????? ?? ?? ?? ???? ???? ??? ? ???. ?????????? ??????? ??????.</span>
        </div>
      )}

      {locked.length > 0 && (
        <div className="text-muted small mt-2">
          <i className="bi bi-info-circle me-1" />
          {locked.length} more hint{locked.length === 1 ? '' : 's'} unlock with each wrong guess.
        </div>
      )}
    </div>
  )
}
