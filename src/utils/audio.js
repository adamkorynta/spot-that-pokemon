// Lightweight chiptune-ish sound effects using the Web Audio API.
// No external files — keeps the bundle small and lets us tweak feel easily.

let ctx = null
let muted = false

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  // Browsers suspend audio contexts until a user gesture; this resumes on first use.
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

function play(notes, { volume = 0.18, wave = 'square' } = {}) {
  if (muted) return
  const ac = getCtx()
  if (!ac) return
  const master = ac.createGain()
  master.gain.value = volume
  master.connect(ac.destination)

  let t = ac.currentTime
  for (const n of notes) {
    const osc = ac.createOscillator()
    const g = ac.createGain()
    osc.type = wave
    osc.frequency.setValueAtTime(n.freq, t)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(1, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t + n.dur)
    osc.connect(g)
    g.connect(master)
    osc.start(t)
    osc.stop(t + n.dur + 0.02)
    t += n.dur
  }
}

export const sfx = {
  setMuted(v)   { muted = !!v },
  isMuted()     { return muted },

  click() {
    play([{ freq: 660, dur: 0.06 }], { volume: 0.08, wave: 'triangle' })
  },
  wrong() {
    play([
      { freq: 220, dur: 0.12 },
      { freq: 150, dur: 0.18 },
    ], { volume: 0.18, wave: 'sawtooth' })
  },
  correct() {
    play([
      { freq: 660,  dur: 0.10 },
      { freq: 880,  dur: 0.10 },
      { freq: 1320, dur: 0.16 },
    ], { volume: 0.18, wave: 'square' })
  },
  reveal() {
    play([
      { freq: 523, dur: 0.09 },
      { freq: 659, dur: 0.09 },
      { freq: 784, dur: 0.09 },
      { freq: 1046, dur: 0.22 },
    ], { volume: 0.2, wave: 'triangle' })
  },
  hint() {
    play([
      { freq: 880, dur: 0.07 },
      { freq: 1175, dur: 0.10 },
    ], { volume: 0.12, wave: 'sine' })
  },
  start() {
    play([
      { freq: 392, dur: 0.10 },
      { freq: 523, dur: 0.10 },
      { freq: 659, dur: 0.14 },
    ], { volume: 0.18, wave: 'square' })
  },
  runaway() {
    // Descending whistle — that classic "uh oh, it got away" vibe.
    play([
      { freq: 880, dur: 0.09 },
      { freq: 740, dur: 0.09 },
      { freq: 587, dur: 0.10 },
      { freq: 440, dur: 0.16 },
      { freq: 294, dur: 0.20 },
    ], { volume: 0.17, wave: 'triangle' })
  },
}
