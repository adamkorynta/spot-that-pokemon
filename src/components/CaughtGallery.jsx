// Shows every Pokémon caught in the current session. Each tile is a small
// sprite tucked inside a Pokéball-styled frame, with a tooltip showing
// the name and points earned in that round.

import { capitalize } from '../utils/helpers.js'
import Pokeball, { ballName } from './Pokeball.jsx'

export default function CaughtGallery({ caught }) {
  if (!caught || !caught.length) return null

  return (
    <div className="poke-panel-yellow p-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h3 className="h6 m-0 fw-bold">
          <i className="bi bi-collection-fill text-danger me-2" />
          Caught this session
        </h3>
        <span className="score-pill" style={{ background: '#fff' }}>
          <i className="bi bi-trophy-fill" /> {caught.length}
        </span>
      </div>

      <div className="caught-grid">
        {caught.map((p, i) => (
          <div
            key={`${p.id}-${i}`}
            className="caught-tile"
            title={`${p.prettyName} • Caught with a ${ballName(p.ballType)} • +${p.roundScore} pts`}
            tabIndex={0}
          >
            <div className="caught-frame">
              <img
                src={p.sprite}
                alt={p.prettyName}
                loading="lazy"
                draggable={false}
                onError={(e) => {
                  if (p.spriteFallback && e.currentTarget.src !== p.spriteFallback) {
                    e.currentTarget.src = p.spriteFallback
                  } else {
                    e.currentTarget.style.visibility = 'hidden'
                  }
                }}
              />
              {p.ballType && (
                <span className="caught-ball-badge" aria-hidden="true">
                  <Pokeball type={p.ballType} />
                </span>
              )}
            </div>
            <span className="caught-name">{p.prettyName}</span>
            {p.types?.length > 0 && (
              <span className={`caught-type type-${p.types[0]}`}>{capitalize(p.types[0])}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
