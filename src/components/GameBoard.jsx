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
      <div className="game-grid">
        {/* Silhouette card — desktop: vertical card on left; mobile/tablet:
            compact horizontal card sticky-pinned to viewport top. */}
        <div className="game-area-silhouette poke-panel-blue">
          <div className="silhouette-card-inner">
            <div className="silhouette-stage-wrap">
              <PokemonSilhouette
                src={round.sprite}
                fallbackSrc={round.spriteFallback}
                blurPx={blurPx}
                revealed={revealed}
                catching={round.catchAnimating}
                ranAway={round.ranAway}
                ballType={round.ballType}
              />
            </div>

            <div className="silhouette-card-info">
              {revealed && (
                <div className="pokemon-name pokemon-name-card">{round.prettyName}</div>
              )}

              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="muted-label">Wrong guesses</span>
                <span className="muted-label">{wrongCount}</span>
              </div>
              <div className="attempts-bar mb-2" aria-hidden="true">
                <div style={{ width: `${pct}%` }} />
              </div>

              <div className="silhouette-actions">
                {!inactive && (
                  <button
                    className="btn btn-outline-dark btn-sm"
                    type="button"
                    onClick={onGiveUp}
                    title="Reveal the answer (no points)"
                  >
                    <i className="bi bi-flag-fill me-1" />
                    <span className="silhouette-btn-label">I give up</span>
                  </button>
                )}
                <button
                  className="btn btn-outline-dark btn-sm"
                  type="button"
                  onClick={onBackToFilters}
                  title="Go back to filters"
                >
                  <i className="bi bi-sliders me-1" />
                  <span className="silhouette-btn-label">Filters</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hints — desktop: under silhouette in left col; mobile: under sticky silhouette */}
        <div className="game-area-hints">
          <HintPanel round={round} />
        </div>

        {/* 25 answer choices — desktop: right column; mobile: below hints */}
        <div className="game-area-answers">
          <AnswerGrid round={round} onGuess={onGuess} />
        </div>
      </div>

      <div className="mt-3">
        <CaughtGallery caught={caught} />
      </div>
    </>
  )
}
