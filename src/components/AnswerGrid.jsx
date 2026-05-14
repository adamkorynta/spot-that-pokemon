import { sfx } from '../utils/audio.js'

// Small front-facing sprite — small file, snappy to render in a 24-button grid.
function spriteForId(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

export default function AnswerGrid({ round, onGuess }) {
  if (!round) return null
  const disabled = round.solved || round.gaveUp || round.ranAway

  return (
    <div className="poke-panel p-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h3 className="h6 m-0 fw-bold">
          <i className="bi bi-grid-3x3-gap-fill text-primary me-2" />
          Pick the Pokémon
        </h3>
        <span className="muted-label">{round.choices.length} choices</span>
      </div>

      <div className="answer-grid" role="listbox" aria-label="Pokémon choices">
        {round.choices.map(choice => {
          const wasWrong = round.wrongChoices.includes(choice.name)
          const isCorrect = round.solved && choice.name === round.prettyName
          const cls = isCorrect ? 'correct' : wasWrong ? 'wrong' : ''
          return (
            <button
              key={choice.id}
              type="button"
              role="option"
              aria-selected={isCorrect}
              aria-label={choice.name}
              className={`answer-btn ${cls}`}
              onClick={() => { sfx.click(); onGuess(choice.name) }}
              disabled={disabled || wasWrong}
            >
              <img
                className="answer-sprite"
                src={spriteForId(choice.id)}
                alt=""
                aria-hidden="true"
                loading="lazy"
                draggable={false}
                onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
              />
              <span className="answer-name">{choice.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
