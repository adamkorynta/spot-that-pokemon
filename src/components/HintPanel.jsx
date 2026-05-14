import { capitalize } from '../utils/helpers.js'

export default function HintPanel({ round }) {
  if (!round) return null
  const revealed = round.hintPipeline.slice(0, round.revealedHints)
  const locked = round.hintPipeline.slice(round.revealedHints)

  return (
    <div className="poke-panel-yellow p-3">
      <h3 className="h6 mb-3 fw-bold">
        <i className="bi bi-lightbulb-fill text-warning me-2" />
        Hints ({round.revealedHints}/{round.hintPipeline.length})
      </h3>

      <div className="d-flex flex-wrap align-items-center mb-2">
        {revealed.map((hint, idx) => {
          if (hint.kind === 'types') {
            return (
              <span key={idx} className="hint-chip">
                <span className="text-muted small">Type:</span>
                {hint.value.map(t => (
                  <span key={t} className={`type-badge type-${t}`}>{capitalize(t)}</span>
                ))}
              </span>
            )
          }
          if (hint.kind === 'flavor') {
            return null // render below in a bigger block
          }
          return (
            <span key={idx} className="hint-chip">
              <span className="text-muted small">{hint.label}:</span>
              <strong>{hint.value}</strong>
            </span>
          )
        })}
      </div>

      {revealed.some(h => h.kind === 'flavor') && (
        <div className="hint-flavor mt-2">
          <span className="d-block muted-label mb-1">Pokédex entry</span>
          {revealed.find(h => h.kind === 'flavor').value}
        </div>
      )}

      {locked.length > 0 && (
        <div className="text-muted small mt-3">
          <i className="bi bi-lock-fill me-1" />
          {locked.length} more hint{locked.length === 1 ? '' : 's'} hidden — guess to reveal.
        </div>
      )}
    </div>
  )
}
