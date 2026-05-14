import PokemonSilhouette from './PokemonSilhouette.jsx'
import HintPanel from './HintPanel.jsx'
import AnswerGrid from './AnswerGrid.jsx'
import CaughtGallery from './CaughtGallery.jsx'

export default function GameBoard({
  round, blurPx, loading, caught, onGuess, onGiveUp, onBackToFilters,
}) {
  if (loading && !round) {
    return (
      <div className="poke-panel p-4 text-center">
        <div className="loading-pokeball mx-auto mb-3" aria-hidden="true" />
        <strong>Catching a Pokémon…</strong>
        <div className="text-muted small">Hang tight — first round can take a moment while we cache data.</div>
      </div>
    )
  }

  if (!round) {
    return (
      <div className="poke-panel p-4 text-center">
        <i className="bi bi-question-octagon-fill display-4 text-danger mb-2 d-block" />
        <h3 className="fw-bold">Ready when you are.</h3>
        <p className="text-muted mb-0">Pick your filters and hit <strong>Start the round</strong>.</p>
      </div>
    )
  }

  const revealed = round.solved || round.gaveUp
  const inactive = revealed || round.ranAway   // no interaction allowed
  const wrongCount = round.wrongChoices.length
  const totalHints = round.hintPipeline.length
  const pct = Math.min(100, (wrongCount / totalHints) * 100)

  return (
    <>
      <div className="row g-3 align-items-start">
        {/* Left column — silhouette + hints (side-by-side with answers on md+) */}
        <div className="col-12 col-md-5 d-flex flex-column gap-3">
          <div className="poke-panel-blue p-3 text-center">
            <PokemonSilhouette
              src={round.sprite}
              fallbackSrc={round.spriteFallback}
              blurPx={blurPx}
              revealed={revealed}
              catching={round.catchAnimating}
              ranAway={round.ranAway}
            />

            {revealed && (
              <div className="pokemon-name mt-3">{round.prettyName}</div>
            )}

            <div className="d-flex justify-content-between align-items-center mt-3 mb-1">
              <span className="muted-label">Wrong guesses</span>
              <span className="muted-label">{wrongCount}</span>
            </div>
            <div className="attempts-bar mb-3" aria-hidden="true">
              <div style={{ width: `${pct}%` }} />
            </div>

            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {!inactive && (
                <button
                  className="btn btn-outline-dark btn-sm"
                  type="button"
                  onClick={onGiveUp}
                  title="Reveal the answer (no points)"
                >
                  <i className="bi bi-flag-fill me-1" />
                  I give up
                </button>
              )}
              <button
                className="btn btn-outline-dark btn-sm"
                type="button"
                onClick={onBackToFilters}
                title="Go back to filters"
              >
                <i className="bi bi-sliders me-1" />
                Change filters
              </button>
            </div>
          </div>

          <HintPanel round={round} />
        </div>

        {/* Right column — the 24 answer choices */}
        <div className="col-12 col-md-7">
          <AnswerGrid round={round} onGuess={onGuess} />
        </div>
      </div>

      <div className="mt-3">
        <CaughtGallery caught={caught} />
      </div>
    </>
  )
}
