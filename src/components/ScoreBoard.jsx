export default function ScoreBoard({ score, streak, bestStreak, roundsPlayed, roundsWon }) {
  const accuracy = roundsPlayed ? Math.round((roundsWon / roundsPlayed) * 100) : 0
  return (
    <div className="d-flex flex-wrap gap-2 align-items-center justify-content-center">
      <span className="score-pill" title="Total points this session">
        <i className="bi bi-star-fill" /> {score} pts
      </span>
      <span className="score-pill" title="Current streak">
        <i className="bi bi-fire" /> Streak {streak}
      </span>
      <span className="score-pill" title="Best streak (saved on this device)">
        <i className="bi bi-trophy-fill" /> Best {bestStreak}
      </span>
      <span className="score-pill" title="Rounds played">
        <i className="bi bi-controller" /> {roundsWon}/{roundsPlayed} · {accuracy}%
      </span>
    </div>
  )
}
