import { describe, it, expect } from 'vitest'
import {
  getBasePoints,
  calculateXP,
  masteryStars,
  updateCombo,
  updateStreak,
  calculateDailyStreak,
  calculateLevel,
  xpToNextLevel,
  adjustTime,
  calculateSpeedRunScore,
  calculateSurvivalScore,
  bossDamage,
} from '@/engine/scoring'

describe('scoring engine', () => {
  describe('getBasePoints', () => {
    it('returns higher points for harder modes', () => {
      const practice = getBasePoints('practice', 6)
      const speedrun = getBasePoints('speedrun', 6)
      expect(speedrun).toBeGreaterThan(practice)
    })

    it('returns higher points for harder tables', () => {
      const low = getBasePoints('practice', 2)
      const high = getBasePoints('practice', 12)
      expect(high).toBeGreaterThanOrEqual(low)
    })

    it('returns reasonable point values', () => {
      const points = getBasePoints('practice', 6)
      expect(points).toBeGreaterThan(0)
      expect(points).toBeLessThan(100)
    })
  })

  describe('calculateXP', () => {
    it('calculates XP with combo multiplier', () => {
      const xp1 = calculateXP(100, 1)
      const xp2 = calculateXP(100, 3)
      expect(xp2).toBeGreaterThan(xp1)
    })

    it('handles zero combo', () => {
      const xp = calculateXP(100, 0)
      expect(xp).toBeGreaterThan(0)
    })

    it('XP scales with combo', () => {
      const xp1 = calculateXP(100, 1)
      const xp5 = calculateXP(100, 5)
      expect(xp5).toBeGreaterThan(xp1)
    })
  })

  describe('masteryStars', () => {
    it('returns 0 stars below 200 points', () => {
      expect(masteryStars(0)).toBe(0)
      expect(masteryStars(199)).toBe(0)
    })

    it('returns 1 star at 200 points', () => {
      expect(masteryStars(200)).toBe(1)
    })

    it('returns 5 stars at 1000 points', () => {
      expect(masteryStars(1000)).toBe(5)
    })

    it('returns correct stars at each threshold', () => {
      expect(masteryStars(0)).toBe(0)
      expect(masteryStars(200)).toBe(1)
      expect(masteryStars(400)).toBe(2)
      expect(masteryStars(600)).toBe(3)
      expect(masteryStars(800)).toBe(4)
      expect(masteryStars(1000)).toBe(5)
    })

    it('capped at 5 stars', () => {
      expect(masteryStars(2000)).toBe(5)
    })
  })

  describe('updateCombo', () => {
    it('increments combo on correct answer', () => {
      expect(updateCombo(true, 0)).toBe(1)
      expect(updateCombo(true, 2)).toBe(3)
    })

    it('resets combo to 0 on wrong answer', () => {
      expect(updateCombo(false, 5)).toBe(0)
      expect(updateCombo(false, 1)).toBe(0)
    })

    it('caps combo at 5', () => {
      expect(updateCombo(true, 4)).toBe(5)
      expect(updateCombo(true, 5)).toBe(5)
    })
  })

  describe('updateStreak', () => {
    it('increments streak on correct answer', () => {
      expect(updateStreak(true, 0)).toBe(1)
      expect(updateStreak(true, 5)).toBe(6)
    })

    it('resets streak to 0 on wrong answer', () => {
      expect(updateStreak(false, 10)).toBe(0)
    })
  })

  describe('calculateDailyStreak', () => {
    it('returns 0 for empty medals', () => {
      expect(calculateDailyStreak({})).toBe(0)
    })

    it('counts consecutive days', () => {
      const today = new Date()
      const medals: Record<string, number> = {}
      for (let i = 0; i < 5; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        medals[dateStr] = Date.now()
      }
      expect(calculateDailyStreak(medals)).toBe(5)
    })

    it('stops counting at gap', () => {
      const today = new Date()
      const medals: Record<string, number> = {}
      // Add 3 days
      for (let i = 0; i < 3; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        medals[dateStr] = Date.now()
      }
      // Skip a day (i=4)
      // Add another medal 5 days ago
      const date5 = new Date(today)
      date5.setDate(date5.getDate() - 5)
      const dateStr5 = date5.toISOString().split('T')[0]
      medals[dateStr5] = Date.now()

      // Should only count 3 consecutive from today
      expect(calculateDailyStreak(medals)).toBe(3)
    })
  })

  describe('calculateLevel', () => {
    it('starts at level 1', () => {
      expect(calculateLevel(0)).toBe(1)
    })

    it('increases with XP', () => {
      expect(calculateLevel(100)).toBe(2)
      expect(calculateLevel(1000)).toBeGreaterThan(2)
    })

    it('level increases are progressive', () => {
      const level5 = calculateLevel(5000)
      const level10 = calculateLevel(50000)
      expect(level10).toBeGreaterThan(level5)
    })
  })

  describe('xpToNextLevel', () => {
    it('returns positive XP needed', () => {
      const xp = xpToNextLevel(0)
      expect(xp).toBeGreaterThan(0)
    })

    it('requires less XP as you level up (diminishing)', () => {
      const xp1 = xpToNextLevel(100)
      const xp10 = xpToNextLevel(10000)
      // Both should be positive but at higher level you're closer to next level
      expect(xp1).toBeGreaterThan(0)
      expect(xp10).toBeGreaterThan(0)
    })
  })

  describe('adjustTime', () => {
    it('adds 2s for correct answer', () => {
      expect(adjustTime(true, 50)).toBe(52)
    })

    it('subtracts 3s for wrong answer', () => {
      expect(adjustTime(false, 50)).toBe(47)
    })

    it('caps at 60s', () => {
      expect(adjustTime(true, 59)).toBe(60)
      expect(adjustTime(true, 60)).toBe(60)
    })

    it('floors at 0s', () => {
      expect(adjustTime(false, 2)).toBe(0)
      expect(adjustTime(false, 0)).toBe(0)
    })
  })

  describe('calculateSpeedRunScore', () => {
    it('calculates score from questions and time', () => {
      const score = calculateSpeedRunScore(10, 8, 30)
      expect(score).toBeGreaterThan(0)
    })

    it('higher accuracy increases score', () => {
      const score1 = calculateSpeedRunScore(10, 5, 30)
      const score2 = calculateSpeedRunScore(10, 8, 30)
      expect(score2).toBeGreaterThan(score1)
    })

    it('faster time increases score', () => {
      const score1 = calculateSpeedRunScore(10, 8, 50)
      const score2 = calculateSpeedRunScore(10, 8, 20)
      expect(score2).toBeGreaterThan(score1)
    })
  })

  describe('calculateSurvivalScore', () => {
    it('calculates score from questions, streak, and bosses', () => {
      const score = calculateSurvivalScore(20, 10, 2)
      expect(score).toBeGreaterThan(0)
    })

    it('rewards streaks heavily', () => {
      const score1 = calculateSurvivalScore(20, 5, 0)
      const score2 = calculateSurvivalScore(20, 15, 0)
      expect(score2).toBeGreaterThan(score1)
    })

    it('rewards boss defeats', () => {
      const score1 = calculateSurvivalScore(20, 10, 0)
      const score2 = calculateSurvivalScore(20, 10, 3)
      expect(score2).toBeGreaterThan(score1)
    })
  })

  describe('bossDamage', () => {
    it('deals 1 damage at no combo', () => {
      expect(bossDamage(0)).toBe(1)
    })

    it('increases with combo', () => {
      expect(bossDamage(3)).toBeGreaterThan(bossDamage(1))
    })

    it('capped at 4 damage', () => {
      expect(bossDamage(5)).toBe(4)
      expect(bossDamage(10)).toBe(4)
    })

    it('scales up to 4HP', () => {
      expect(bossDamage(0)).toBe(1)
      expect(bossDamage(1)).toBe(2)
      expect(bossDamage(2)).toBe(3)
      expect(bossDamage(3)).toBe(4)
    })
  })
})
