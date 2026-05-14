import { useState } from 'react'
import FilterPanel from './components/FilterPanel.jsx'
import GameBoard from './components/GameBoard.jsx'
import ScoreBoard from './components/ScoreBoard.jsx'
import ResultsModal from './components/ResultsModal.jsx'
import { useGame } from './hooks/useGame.js'

export default function App() {
  const game = useGame()
  const [view, setView] = useState('filters') // 'filters' | 'play'

  const handleStart = async () => {
    setView('play')
    await game.startRound()
  }

  const handleNext = async () => {
    await game.startRound()
  }

  const handleBackToFilters = () => {
    setView('filters')
  }

  return (
    <div className="app-shell">
      <header className="app-header py-3 mb-3">
        <div className="container d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <img src="./pokeball.svg" width="44" height="44" alt="" aria-hidden="true" />
            <h1 className="app-title m-0">Spot That <span className="accent">Pokémon!</span></h1>
          </div>
          <ScoreBoard
            score={game.score}
            streak={game.streak}
            bestStreak={game.bestStreak}
            roundsPlayed={game.roundsPlayed}
            roundsWon={game.roundsWon}
          />
        </div>
      </header>

      <main className="container flex-grow-1 pb-5">
        <div className="row g-4">
          {view === 'filters' && (
            <div className="col-12 col-lg-7 mx-auto">
              <FilterPanel
                filters={game.filters}
                difficulty={game.difficulty}
                muted={game.muted}
                pool={game.pool}
                loading={game.loading}
                error={game.error}
                onChangeFilters={game.setFilters}
                onChangeDifficulty={game.setDifficulty}
                onToggleMute={() => game.setMuted(!game.muted)}
                onStart={handleStart}
              />
              <p className="text-center text-muted small mt-3 mb-0">
                Hint: keep it on <strong>Gen 1, Normal only</strong> for the friendliest first round.
              </p>
            </div>
          )}

          {view === 'play' && (
            <div className="col-12">
              <GameBoard
                round={game.round}
                blurPx={game.blurPx}
                loading={game.loading}
                caught={game.caught}
                onGuess={game.guess}
                onGiveUp={game.giveUp}
                onBackToFilters={handleBackToFilters}
              />
            </div>
          )}
        </div>
      </main>

      <footer className="text-center small text-muted py-3">
        <span>
          Pokémon data and artwork from <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokéAPI</a>.
          Pokémon © Nintendo / Game Freak.
        </span>
      </footer>

      <ResultsModal
        round={game.round}
        onNext={handleNext}
        onChangeFilters={handleBackToFilters}
      />
    </div>
  )
}
