import { describe, it, expect, beforeEach } from 'vitest'
import { useSessionStore } from '@/store/sessionStore'

describe('sessionStore', () => {
  beforeEach(() => {
    useSessionStore.getState().resetSession()
  })

  it('initializes with default state', () => {
    const state = useSessionStore.getState()
    expect(state.mode).toBe('practice')
    expect(state.questionsAnswered).toBe(0)
    expect(state.correctAnswers).toBe(0)
    expect(state.lives).toBe(3)
    expect(state.bossHP).toBe(10)
  })

  it('starts session with mode and table', () => {
    useSessionStore.getState().startSession('speedrun', 5)

    const state = useSessionStore.getState()
    expect(state.mode).toBe('speedrun')
    expect(state.currentTable).toBe(5)
  })

  it('resets session state', () => {
    useSessionStore.getState().startSession('boss', 7)
    useSessionStore.getState().resetSession()

    const state = useSessionStore.getState()
    expect(state.mode).toBe('practice')
    expect(state.currentTable).toBe(2)
  })

  it('sets question', () => {
    const question = {
      a: 5,
      b: 3,
      answer: 15,
      table: 5,
      mode: 'practice' as const,
      choices: [15, 12, 18, 20],
      correctIndex: 0,
    }

    useSessionStore.getState().setQuestion(question)
    const state = useSessionStore.getState()

    expect(state.currentQuestion).toEqual(question)
    expect(state.selectedAnswer).toBeNull()
    expect(state.answered).toBe(false)
  })

  it('selects answer', () => {
    useSessionStore.getState().selectAnswer(2)
    const selected = useSessionStore.getState().selectedAnswer

    expect(selected).toBe(2)
  })

  it('marks correct answer', () => {
    useSessionStore.getState().markAnswered(true)
    const state = useSessionStore.getState()

    expect(state.questionsAnswered).toBe(1)
    expect(state.correctAnswers).toBe(1)
    expect(state.streak).toBe(1)
    expect(state.comboMultiplier).toBe(2)
  })

  it('marks incorrect answer', () => {
    useSessionStore.getState().markAnswered(true) // First correct to build streak
    useSessionStore.getState().setQuestion({
      a: 3,
      b: 4,
      answer: 12,
      table: 3,
      mode: 'practice',
      choices: [12, 11, 13, 14],
      correctIndex: 0,
    })
    useSessionStore.getState().markAnswered(false)

    const state = useSessionStore.getState()
    expect(state.questionsAnswered).toBe(2)
    expect(state.correctAnswers).toBe(1)
    expect(state.streak).toBe(0)
    expect(state.comboMultiplier).toBe(1)
  })

  it('caps combo at 5x', () => {
    useSessionStore.getState().startSession('practice', 2)
    for (let i = 0; i < 10; i++) {
      useSessionStore.getState().markAnswered(true)
    }

    const combo = useSessionStore.getState().comboMultiplier
    expect(combo).toBe(5)
  })

  it('updates timer', () => {
    useSessionStore.getState().updateTimer(45)
    const time = useSessionStore.getState().timeRemaining

    expect(time).toBe(45)
  })

  it('takes damage', () => {
    useSessionStore.getState().startSession('survival', 2)
    useSessionStore.getState().takeDamage()

    const lives = useSessionStore.getState().lives
    expect(lives).toBe(2)
  })

  it('lives minimum is 0', () => {
    useSessionStore.getState().startSession('survival', 2)
    for (let i = 0; i < 10; i++) {
      useSessionStore.getState().takeDamage()
    }

    const lives = useSessionStore.getState().lives
    expect(lives).toBe(0)
  })

  it('restores live', () => {
    useSessionStore.getState().startSession('survival', 2)
    useSessionStore.getState().takeDamage()
    useSessionStore.getState().restoreLive()

    const lives = useSessionStore.getState().lives
    expect(lives).toBe(3)
  })

  it('lives capped at 3', () => {
    useSessionStore.getState().startSession('survival', 2)
    for (let i = 0; i < 5; i++) {
      useSessionStore.getState().restoreLive()
    }

    const lives = useSessionStore.getState().lives
    expect(lives).toBe(3)
  })

  it('damages boss HP', () => {
    useSessionStore.getState().startSession('boss', 2)
    useSessionStore.getState().damageToHP(3)

    const hp = useSessionStore.getState().bossHP
    expect(hp).toBe(7)
  })

  it('boss HP minimum is 0', () => {
    useSessionStore.getState().startSession('boss', 2)
    useSessionStore.getState().damageToHP(20)

    const hp = useSessionStore.getState().bossHP
    expect(hp).toBe(0)
  })

  it('tracks combo separately from streak', () => {
    useSessionStore.getState().startSession('practice', 2)

    // Build streak and combo
    for (let i = 0; i < 3; i++) {
      useSessionStore.getState().markAnswered(true)
    }

    const state1 = useSessionStore.getState()
    expect(state1.streak).toBe(3)
    expect(state1.comboMultiplier).toBe(4)

    // Wrong answer resets both
    useSessionStore.getState().markAnswered(false)

    const state2 = useSessionStore.getState()
    expect(state2.streak).toBe(0)
    expect(state2.comboMultiplier).toBe(1)
  })
})
