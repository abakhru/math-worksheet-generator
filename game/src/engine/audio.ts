// Web Audio API synthesizer - no external audio files
let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioContext
}

function playTone(frequency: number, duration: number = 0.1, volume: number = 0.3) {
  const ctx = getAudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.frequency.value = frequency
  osc.type = 'sine'

  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

function playFrequencySequence(
  frequencies: number[],
  duration: number = 0.1,
  gap: number = 0.05,
  volume: number = 0.3
) {
  let delay = 0
  frequencies.forEach((freq) => {
    setTimeout(() => playTone(freq, duration, volume), delay * 1000)
    delay += duration + gap
  })
}

export const audioEngine = {
  // Correct answer: upward arpeggio
  correct() {
    const frequencies = [262, 330, 392, 523] // C, E, G, C (major arpeggio)
    playFrequencySequence(frequencies, 0.1, 0.05, 0.4)
  },

  // Wrong answer: buzz tone
  wrong() {
    playTone(150, 0.3, 0.3)
    playTone(130, 0.25, 0.2)
  },

  // Combo milestone: ascending sweep
  combo() {
    const frequencies = [392, 440, 494] // G, A, B
    playFrequencySequence(frequencies, 0.08, 0.02, 0.35)
  },

  // Boss hit: power chord
  bossHit() {
    playTone(130, 0.15, 0.4) // E2
    playTone(196, 0.15, 0.35) // G2
  },

  // Boss victory: triumphant jingle
  bossVictory() {
    const frequencies = [330, 392, 494, 587, 659] // E, G, B, D, E (major scale)
    playFrequencySequence(frequencies, 0.12, 0.08, 0.4)
  },

  // Tick sound (mode transition)
  tick() {
    playTone(880, 0.05, 0.2)
  },

  // Game over: sad trombone
  gameOver() {
    const frequencies = [392, 349, 330, 294]
    playFrequencySequence(frequencies, 0.15, 0.1, 0.3)
  },

  // Daily challenge complete: celebration
  dailyComplete() {
    const frequencies = [523, 587, 659, 784]
    playFrequencySequence(frequencies, 0.1, 0.06, 0.4)
  },

  // Level up: ascending bells
  levelUp() {
    const frequencies = [523, 659, 784, 1047]
    playFrequencySequence(frequencies, 0.15, 0.1, 0.35)
  },
}
