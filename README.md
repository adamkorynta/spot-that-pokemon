# Spot That Pokémon!

A family-friendly multiple-choice Pokémon guessing game. Pick the right Pokémon from 24 choices using a blurred silhouette and progressive hints — no typing required.

## Quick start

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build for deployment

```bash
npm run build
npm run preview   # to test the production build locally
```

The contents of `dist/` can be dropped onto Vercel, Netlify, GitHub Pages, or any static host.

## How it works

- **Stack:** React 18 + Vite + Bootstrap 5
- **Data:** [PokéAPI](https://pokeapi.co/) — cached in `localStorage` so repeat plays are fast
- **State:** all in the `useGame` hook in `src/hooks/useGame.js`

### Game flow

1. The Filter Panel lets you choose generations, types, category (Normal / Legendary / Mythical / Any), and difficulty.
2. A round picks one Pokémon from the filtered pool and 23 plausible distractors from the same pool.
3. The silhouette starts heavily blurred and shadow-filled. Each wrong guess reveals one hint and slightly reduces the blur.
4. Correct guess → full reveal, points awarded based on how few wrong guesses you used.
5. Streak and best-streak persist on this device.

### Difficulty

- **Easy** (default): 6 progressive hints — Type → Generation → Evolution → Size → Ability → Pokédex entry
- **Hard:** 4 hints starting with the (name-redacted) Pokédex entry

### Scoring

- Round starts at 200 points
- −12 per wrong guess
- −8 per hint revealed
- Minimum 20 points per correct round

## Project layout

```
src/
├── App.jsx
├── main.jsx
├── components/
│   ├── FilterPanel.jsx
│   ├── GameBoard.jsx
│   ├── PokemonSilhouette.jsx
│   ├── HintPanel.jsx
│   ├── AnswerGrid.jsx
│   ├── ScoreBoard.jsx
│   └── ResultsModal.jsx
├── hooks/
│   └── useGame.js
├── services/
│   ├── pokeapi.js     # cached PokéAPI calls + flavor-text redaction
│   └── pool.js        # builds the candidate ID pool from filters
├── data/
│   └── pokedexIndex.js # generations + legendary/mythical ID sets
├── utils/
│   ├── audio.js        # Web Audio chiptune SFX (no asset files)
│   └── helpers.js
└── styles/
    └── index.css       # Pokémon-inspired theme on top of Bootstrap
```

## Notes

- Pokémon names are redacted from Pokédex flavor text before being shown as hints.
- The candidate pool re-resets when every Pokémon in it has been used in the current session.
- Audio uses the Web Audio API and only starts after your first interaction (browser autoplay policy).
- Pokémon, Pokédex, and all related artwork © Nintendo / Game Freak / Creatures.
