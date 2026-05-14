# Claude Code Project Starter: Spot That Pokémon

## Project Overview

Build a family-friendly web app called **Spot That Pokémon** where players identify a hidden Pokémon from multiple-choice answers instead of typing names.

### Core Gameplay Loop

* Randomly select a Pokémon from the available Pokédex pool
* Optional filters before starting:

  * Generation (Gen 1–9)
  * Type (Fire, Water, Grass, etc.)
  * Legendary / Mythical / Normal
* Display a Pokémon sprite with:

  * Heavy blur
  * Dark shadow overlay
  * No visible name
* Show **20 multiple-choice Pokémon names** (1 correct + 19 distractors)
* After each incorrect guess:

  * Reveal a new hint
  * Reduce blur progressively
  * Keep silhouette/shadow until final reveal
* On correct guess:

  * Reveal full sprite
  * Show name
  * Display score based on attempts

---

## MVP Tech Stack

* **Frontend:** React + Vite
* **Styling:** Bootstrap
* **Data Source:** PokéAPI

  * [https://pokeapi.co/](https://pokeapi.co/)
* **State Management:** React state or Zustand
* **Deployment:** Vercel or Netlify

---

## Functional Requirements

### Pokémon Selection Engine

* Random selection based on filters:

  * Generation
  * Type
  * Legendary/Mythical status
* Avoid repeating Pokémon in a session
* Generate 20 choices:

  * 1 correct answer
  * 19 distractors (filtered, plausible)
* Shuffle answer list

---

### Hint System (Progressive Reveal)

Hints are unlocked after each incorrect guess:

1. Type(s)
2. Generation
3. Evolution stage
4. Height / weight
5. Ability
6. Redacted Pokédex entry (name replaced with “?????”)

---

### Visual Reveal System

* Start with heavy blur + silhouette overlay
* Reduce blur after each guess
* Shadow remains until final reveal
* Full reveal only on correct answer

---

### Scoring

* Fewer guesses = higher score
* Optional:

  * streak tracking
  * “3 strikes” mode

---

## UI/UX Requirements

* Designed for kids/families
* Large touch-friendly buttons
* Bright Pokémon-style UI
* Mobile responsive
* Accessibility:

  * high contrast mode
  * keyboard navigation
  * screen reader labels

---

## Suggested Component Structure

* `App`
* `FilterPanel`
* `GameBoard`
* `PokemonSilhouette`
* `HintPanel`
* `AnswerGrid`
* `ScoreBoard`
* `ResultsModal`

---

## PokéAPI Integration

Use these endpoints:

* `/pokemon/{id}`
* `/pokemon-species/{id}`
* `/generation/{id}`
* `/type/{id}`

### Notes

* Cache Pokémon lists locally
* Minimize API calls during gameplay
* Preload sprite URLs for smooth rendering

---

## Stretch Goals

* Daily challenge mode
* “Who’s That Pokémon?” style animation transitions
* Sound effects
* Local leaderboard
* Multiplayer pass-and-play
* Difficulty modes:

  * Easy: obvious hints early
  * Hard: mostly Pokédex-only clues

---

## Build Priorities (Claude Code)

1. Scaffold React + Vite project
2. Configure Bootstrap
3. Build PokéAPI service layer
4. Implement filtering logic
5. Build Pokémon selection engine
6. Build 20-option answer grid
7. Implement blur + silhouette system
8. Add progressive hint system
9. Add scoring
10. Polish UI/UX

---

## Key Rules

* Always multiple choice (never free text guessing)
* Never expose Pokémon name in hints
* Ensure distractors are plausible
* Optimize for kids (simplicity > complexity)
* Handle API failures gracefully
* Prioritize performance and caching

---

## Example Flow

1. User selects filters (e.g., Gen 1, Fire types)
2. Game selects Charizard
3. Blurred silhouette shown
4. 20 answer options displayed
5. User guesses incorrectly
6. Hint: “Fire/Flying type”
7. Blur decreases
8. Next guess incorrect
9. Hint: “Final evolution”
10. Correct guess → reveal + score

---
