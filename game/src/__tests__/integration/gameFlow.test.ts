import { describe, it, expect, beforeEach } from 'vitest'
import { usePlayerStore } from '@/store/playerStore'
import { useProgressStore } from '@/store/progressStore'
import { useSessionStore } from '@/store/sessionStore'
import { generateMultipleChoiceQuestion, generateQuestion } from '@/engine/questions'
import { getBasePoints, calculateXP } from '@/engine/scoring'
import { isTableUnlocked, getUnlockedTables } from '@/engine/mastery'

describe('game flow integration', () => {
  beforeEach(() => {
    usePlayerStore.getState().initializePlayer('TestPlayer')
    useProgressStore.getState().initializeProgress()
    useSessionStore.getState().resetSession()
  })

  it('complete practice question flow', () => {
    // Setup
    const player = usePlayerStore.getState()
    const progress = useProgressStore.getState()
    const session = useSessionStore.getState()

    const startXP = player.player?.totalXP ?? 0

    // Start session
    session.startSession('practice', 5)
    expect(session.currentQuestion).toBeNull()

    // Generate question
    const q = generateQuestion(5, 'practice')
    const mcq = generateMultipleChoiceQuestion(q)
    session.setQuestion(mcq)
    expect(session.currentQuestion).not.toBeNull()

    // Select answer (correct)
    session.selectAnswer(mcq.correctIndex)
    expect(session.selectedAnswer).toBe(mcq.correctIndex)

    // Mark answered
    const points = getBasePoints('practice', 5)
    const xp = calculateXP(points, 1)

    session.markAnswered(true)
    player.addXP(xp)
    progress.addMasteryPoints(5, points)

    // Verify state
    expect(session.questionsAnswered).toBe(1)
    expect(session.correctAnswers).toBe(1)
    expect(session.streak).toBe(1)
    expect(player.player!.totalXP).toBeGreaterThan(startXP)
    expect(progress.progress[5].masteryPoints).toBeGreaterThan(0)
  })

  it('combo builds and persists across questions', () => {
    const session = useSessionStore.getState()

    session.startSession('practice', 3)

    // Answer 3 questions correctly
    for (let i = 0; i < 3; i++) {
      const q = generateQuestion(3, 'practice')
      const mcq = generateMultipleChoiceQuestion(q)
      session.setQuestion(mcq)
      session.selectAnswer(mcq.correctIndex)
      session.markAnswered(true)
    }

    const state = useSessionStore((s) => s)
    expect(state.streak).toBe(3)
    expect(state.comboMultiplier).toBe(4) // 1 -> 2 -> 3 -> 4
  })

  it('combo resets on wrong answer', () => {
    const session = useSessionStore.getState()

    session.startSession('practice', 4)

    // Answer correctly 5 times
    for (let i = 0; i < 5; i++) {
      const q = generateQuestion(4, 'practice')
      const mcq = generateMultipleChoiceQuestion(q)
      session.setQuestion(mcq)
      session.selectAnswer(mcq.correctIndex)
      session.markAnswered(true)
    }

    let state = useSessionStore((s) => s)
    expect(state.comboMultiplier).toBe(5) // Capped at 5

    // Answer incorrectly
    const q = generateQuestion(4, 'practice')
    const mcq = generateMultipleChoiceQuestion(q)
    session.setQuestion(mcq)
    session.selectAnswer((mcq.correctIndex + 1) % 4)
    session.markAnswered(false)

    state = useSessionStore((s) => s)
    expect(state.comboMultiplier).toBe(1) // Reset
    expect(state.streak).toBe(0) // Reset
  })

  it('survival mode loses lives on wrong answers', () => {
    const session = useSessionStore.getState()

    session.startSession('survival', 6)
    expect(session.lives).toBe(3)

    // Answer wrong 3 times
    for (let i = 0; i < 3; i++) {
      const q = generateQuestion(6, 'survival')
      const mcq = generateMultipleChoiceQuestion(q)
      session.setQuestion(mcq)
      session.selectAnswer((mcq.correctIndex + 1) % 4)
      session.markAnswered(false)
      session.takeDamage()
    }

    const lives = useSessionStore((s) => s.lives)
    expect(lives).toBe(0)
  })

  it('boss battle damages boss HP', () => {
    const session = useSessionStore.getState()

    session.startSession('boss', 7)
    expect(session.bossHP).toBe(10)

    // Answer 5 questions correctly
    for (let i = 0; i < 5; i++) {
      const q = generateQuestion(7, 'boss')
      const mcq = generateMultipleChoiceQuestion(q)
      session.setQuestion(mcq)
      session.selectAnswer(mcq.correctIndex)
      session.markAnswered(true)

      // Damage scales with combo
      const combo = useSessionStore((s) => s.comboMultiplier)
      const damage = Math.min(1 + combo - 1, 4)
      session.damageToHP(damage)
    }

    const hp = useSessionStore((s) => s.bossHP)
    expect(hp).toBeLessThan(10)
  })

  it('progression: mastery points lead to stars', () => {
    const progress = useProgressStore.getState()

    // Add questions until we hit 1 star
    for (let i = 0; i < 20; i++) {
      progress.addMasteryPoints(8, 10)
    }

    const table = progress.progress[8]
    expect(table.stars).toBeGreaterThanOrEqual(1)
  })

  it('unlocking tables through mastery', () => {
    const progress = useProgressStore.getState()

    // Table 3 is locked initially
    let unlocked = getUnlockedTables(progress.progress)
    expect(unlocked).not.toContain(3)

    // Add mastery points to table 2 until 2 stars
    for (let i = 0; i < 25; i++) {
      progress.addMasteryPoints(2, 10)
    }

    // Now table 3 should be unlocked
    unlocked = getUnlockedTables(progress.progress)
    expect(unlocked).toContain(3)
  })

  it('daily streak tracking', () => {
    const progress = useProgressStore.getState()
    const today = new Date()

    // Add medals for 5 consecutive days
    for (let i = 0; i < 5; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      progress.addDailyMedal(dateStr)
    }

    const streak = progress.getDailyStreak()
    expect(streak).toBe(5)
  })

  it('achievement unlocking through gameplay', () => {
    const player = usePlayerStore.getState()
    const progress = useProgressStore.getState()

    // Unlock first-answer achievement
    progress.unlockAchievement('first-answer')

    const unlocked = progress.getUnlockedAchievements()
    expect(unlocked).toContain('first-answer')

    // Unlock multiple achievements
    progress.unlockAchievement('streak-3')
    progress.unlockAchievement('table-master')

    const allUnlocked = progress.getUnlockedAchievements()
    expect(allUnlocked.length).toBe(3)
  })

  it('full session: 10 questions in practice mode', () => {
    const player = usePlayerStore.getState()
    const progress = useProgressStore.getState()
    const session = useSessionStore.getState()

    const startXP = player.player?.totalXP ?? 0
    const startMastery = progress.progress[5].masteryPoints

    session.startSession('practice', 5)

    // Answer 10 questions
    let correctCount = 0
    for (let i = 0; i < 10; i++) {
      const q = generateQuestion(5, 'practice')
      const mcq = generateMultipleChoiceQuestion(q)
      session.setQuestion(mcq)

      // Randomly correct or incorrect
      const isCorrect = Math.random() > 0.3
      if (isCorrect) {
        session.selectAnswer(mcq.correctIndex)
        correctCount++
      } else {
        session.selectAnswer((mcq.correctIndex + 1) % 4)
      }

      session.markAnswered(isCorrect)

      if (isCorrect) {
        const points = getBasePoints('practice', 5)
        const combo = useSessionStore((s) => s.comboMultiplier)
        const xp = calculateXP(points, combo)
        player.addXP(xp)
        progress.addMasteryPoints(5, points)
      }
    }

    // Verify results
    const finalSession = useSessionStore((s) => s)
    expect(finalSession.questionsAnswered).toBe(10)
    expect(finalSession.correctAnswers).toBe(correctCount)

    const finalPlayer = usePlayerStore((s) => s.player)
    expect(finalPlayer!.totalXP).toBeGreaterThan(startXP)

    const finalMastery = useProgressStore((s) => s.progress[5].masteryPoints)
    expect(finalMastery).toBeGreaterThan(startMastery)
  })
})
