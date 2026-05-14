import { useEffect, useRef, useState } from 'react'

export default function PokemonSilhouette({
  src, fallbackSrc, blurPx, revealed, catching, ranAway,
}) {
  const [errored, setErrored] = useState(false)
  const [flash, setFlash] = useState(false)
  const prevSrc = useRef(src)

  useEffect(() => {
    if (prevSrc.current !== src) {
      setFlash(true)
      const t = setTimeout(() => setFlash(false), 600)
      prevSrc.current = src
      return () => clearTimeout(t)
    }
  }, [src])

  if (!src) {
    return (
      <div className="silhouette-stage" aria-label="Waiting for round to start">
        <div className="loading-pokeball" aria-hidden="true" />
      </div>
    )
  }

  // During a runaway we treat the Pokémon as "revealed" so the player gets a
  // brief glimpse of what they missed before it slides off-screen.
  const showRevealed = revealed || ranAway

  const dynamicFilter = showRevealed
    ? 'none'
    : `brightness(0) saturate(100%) blur(${blurPx}px)`

  return (
    <div
      className={`silhouette-stage ${showRevealed ? 'revealed' : ''} ${catching ? 'catching' : ''} ${ranAway ? 'runaway' : ''}`}
      aria-label={
        ranAway  ? 'The Pokémon ran away!' :
        catching ? 'Catching the Pokémon!' :
        revealed ? 'Pokémon revealed' :
        'Mystery Pokémon silhouette'
      }
    >
      <img
        key={src}
        src={errored ? fallbackSrc : src}
        alt={showRevealed ? 'Revealed Pokémon' : 'Blurred Pokémon silhouette'}
        className={`silhouette-sprite ${showRevealed ? 'revealed' : ''} ${catching ? 'catching' : ''} ${ranAway ? 'runaway' : ''} ${flash ? 'flash' : ''}`}
        style={showRevealed ? { filter: 'none' } : { filter: dynamicFilter }}
        onError={() => setErrored(true)}
        draggable={false}
      />

      {catching && (
        <>
          <div className="catch-pokeball" aria-hidden="true">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <clipPath id="pbclip"><circle cx="50" cy="50" r="46"/></clipPath>
              </defs>
              <circle cx="50" cy="50" r="46" fill="#fff" stroke="#222" strokeWidth="5"/>
              <rect x="0" y="0" width="100" height="50" fill="#ee1515" clipPath="url(#pbclip)"/>
              <rect x="0" y="45" width="100" height="10" fill="#222"/>
              <circle cx="50" cy="50" r="14" fill="#fff" stroke="#222" strokeWidth="5"/>
              <circle cx="50" cy="50" r="6" fill="#fff" stroke="#222" strokeWidth="3"/>
            </svg>
          </div>
          <div className="catch-stars" aria-hidden="true">
            {[...Array(8)].map((_, i) => (
              <span key={i} style={{ '--i': i }} />
            ))}
          </div>
          <div className="catch-fireworks" aria-hidden="true">
            {['fw-1', 'fw-2', 'fw-3'].map((cls) => (
              <div key={cls} className={`firework ${cls}`}>
                {[...Array(10)].map((_, i) => (
                  <span key={i} style={{ '--i': i }} />
                ))}
              </div>
            ))}
          </div>
        </>
      )}

      {ranAway && (
        <>
          <div className="runaway-dust" aria-hidden="true">
            <span /><span /><span /><span />
          </div>
          <div className="runaway-banner" aria-hidden="true">It got away!</div>
        </>
      )}
    </div>
  )
}
