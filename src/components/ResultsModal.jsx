import { capitalize } from '../utils/helpers.js'
import Pokeball, { ballName } from './Pokeball.jsx'

export default function ResultsModal({ round, onNext, onChangeFilters }) {
  if (!round) return null
  if (!round.solved && !round.gaveUp) return null
  if (round.catchAnimating) return null   // wait for the catch animation

  return (
    <div className="results-overlay" role="dialog" aria-modal="true" aria-labelledby="results-title">
      <div className="results-modal">
        <h2 id="results-title" className="h4 fw-bold mb-2">
          {round.solved
            ? <><i className="bi bi-stars text-warning me-2" />Gotcha! Caught!</>
            : <><i className="bi bi-flag-fill text-danger me-2" />Round over</>}
        </h2>

        <div className="mb-3">
          <img
            src={round.sprite}
            alt={round.prettyName}
            style={{ width: 180, height: 180, objectFit: 'contain' }}
          />
        </div>

        <div className="pokemon-name mb-2">{round.prettyName}</div>

        <div className="mb-3">
          {round.types.map(t => (
            <span key={t} className={`type-badge type-${t}`}>{capitalize(t)}</span>
          ))}
        </div>

        <div className="row text-start small mb-3">
          <div className="col-6">
            <div className="muted-label">Generation</div>
            <div className="fw-bold">{round.region}</div>
          </div>
          <div className="col-6">
            <div className="muted-label">Stage</div>
            <div className="fw-bold">{round.evolutionStage ?? 'Unknown'}</div>
          </div>
          <div className="col-6 mt-2">
            <div className="muted-label">Height</div>
            <div className="fw-bold">{round.height}</div>
          </div>
          <div className="col-6 mt-2">
            <div className="muted-label">Weight</div>
            <div className="fw-bold">{round.weight}</div>
          </div>
        </div>

        {round.solved ? (
          <>
            <div className="caught-with-ball mb-3" aria-label={`Caught with a ${ballName(round.ballType)}`}>
              <div className="caught-with-ball-icon">
                <Pokeball type={round.ballType} />
              </div>
              <div className="caught-with-ball-label">
                Caught with a <strong>{ballName(round.ballType)}</strong>
              </div>
            </div>
            <div className="alert alert-success py-2 mb-3">
              <strong>+{round.roundScore} pts</strong> · {round.wrongChoices.length} wrong guess{round.wrongChoices.length === 1 ? '' : 'es'}
            </div>
          </>
        ) : (
          <div className="alert alert-secondary py-2 mb-3">
            No points this round — better luck on the next one!
          </div>
        )}

        <div className="d-flex flex-wrap gap-2 justify-content-center">
          <button className="btn btn-poke btn-lg" type="button" onClick={onNext} autoFocus>
            <i className="bi bi-arrow-right-circle-fill me-2" />
            Next Pokémon
          </button>
          <button className="btn btn-outline-dark" type="button" onClick={onChangeFilters}>
            Change filters
          </button>
        </div>
      </div>
    </div>
  )
}
