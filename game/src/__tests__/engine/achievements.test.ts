import { describe, it, expect } from 'vitest'
import { checkAchievements, ALL_ACHIEVEMENTS } from '@/engine/achievements'
import { TableProgress } from '@/types'

describe('achievements engine', () => {
  describe('ALL_ACHIEVEMENTS', () => {
    it('contains 19 achievements', () => {
      expect(ALL_ACHIEVEMENTS).toHaveLength(19)
    })

    it('all achievements have required fields', () => {
      ALL_ACHIEVEMENTS.forEach((ach) => {
        expect(ach.id).toBeDefined()
        expect(ach.title).toBeDefined()
        expect(ach.description).toBeDefined()
        expect(ach.icon).toBeDefined()
      })
    })

    it('all achievement IDs are unique', () => {
      const ids = ALL_ACHIEVEMENTS.map((a) => a.id)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  describe('checkAchievements', () => {
    const emptyUnlocked = new Set<string>()
    const emptyProgress: Record<number, Partial<TableProgress>> = {}

    it('unlocks first-answer on first correct', () => {
      const checks = checkAchievements(
        {
          mode: 'practice',
          correct: true,
          streak: 1,
          maxStreak: 1,
          comboMultiplier: 1,
          totalCorrect: 1,
          level: 1,
          maxTableStars: 0,
          dailyStreak: 0,
        },
        emptyProgress,
        emptyUnlocked
      )
      expect(checks.some((c) => c.id === 'first-answer')).toBe(true)
    })

    it('unlocks streak-3 at 3-streak', () => {
      const checks = checkAchievements(
        {
          mode: 'practice',
          correct: true,
          streak: 3,
          maxStreak: 3,
          comboMultiplier: 1,
          totalCorrect: 3,
          level: 1,
          maxTableStars: 0,
          dailyStreak: 0,
        },
        emptyProgress,
        emptyUnlocked
      )
      expect(checks.some((c) => c.id === 'streak-3')).toBe(true)
    })

    it('unlocks streak-10 at 10-streak', () => {
      const checks = checkAchievements(
        {
          mode: 'practice',
          correct: true,
          streak: 10,
          maxStreak: 10,
          comboMultiplier: 1,
          totalCorrect: 10,
          level: 1,
          maxTableStars: 0,
          dailyStreak: 0,
        },
        emptyProgress,
        emptyUnlocked
      )
      expect(checks.some((c) => c.id === 'streak-10')).toBe(true)
    })

    it('unlocks table-master at 5 stars', () => {
      const checks = checkAchievements(
        {
          mode: 'practice',
          correct: true,
          streak: 1,
          maxStreak: 1,
          comboMultiplier: 1,
          totalCorrect: 1,
          level: 1,
          maxTableStars: 5,
          dailyStreak: 0,
        },
        emptyProgress,
        emptyUnlocked
      )
      expect(checks.some((c) => c.id === 'table-master')).toBe(true)
    })

    it('unlocks combo-5x at 5x combo', () => {
      const checks = checkAchievements(
        {
          mode: 'practice',
          correct: true,
          streak: 5,
          maxStreak: 5,
          comboMultiplier: 5,
          totalCorrect: 5,
          level: 1,
          maxTableStars: 0,
          dailyStreak: 0,
        },
        emptyProgress,
        emptyUnlocked
      )
      expect(checks.some((c) => c.id === 'combo-5x')).toBe(true)
    })

    it('unlocks practice-50 at 50 correct answers', () => {
      const checks = checkAchievements(
        {
          mode: 'practice',
          correct: true,
          streak: 1,
          maxStreak: 1,
          comboMultiplier: 1,
          totalCorrect: 50,
          level: 1,
          maxTableStars: 0,
          dailyStreak: 0,
        },
        emptyProgress,
        emptyUnlocked
      )
      expect(checks.some((c) => c.id === 'practice-50')).toBe(true)
    })

    it('unlocks speedrun-beat in speedrun mode', () => {
      const checks = checkAchievements(
        {
          mode: 'speedrun',
          correct: true,
          streak: 1,
          maxStreak: 1,
          comboMultiplier: 1,
          totalCorrect: 1,
          level: 1,
          maxTableStars: 0,
          dailyStreak: 0,
        },
        emptyProgress,
        emptyUnlocked
      )
      expect(checks.some((c) => c.id === 'speedrun-beat')).toBe(true)
    })

    it('unlocks boss-slayer on boss defeat', () => {
      const checks = checkAchievements(
        {
          mode: 'boss',
          correct: true,
          streak: 1,
          maxStreak: 1,
          comboMultiplier: 1,
          totalCorrect: 1,
          level: 1,
          maxTableStars: 0,
          dailyStreak: 0,
          bossDefeated: true,
        },
        emptyProgress,
        emptyUnlocked
      )
      expect(checks.some((c) => c.id === 'boss-slayer')).toBe(true)
    })

    it('unlocks daily-1 in daily mode', () => {
      const checks = checkAchievements(
        {
          mode: 'daily',
          correct: true,
          streak: 1,
          maxStreak: 1,
          comboMultiplier: 1,
          totalCorrect: 1,
          level: 1,
          maxTableStars: 0,
          dailyStreak: 1,
        },
        emptyProgress,
        emptyUnlocked
      )
      expect(checks.some((c) => c.id === 'daily-1')).toBe(true)
    })

    it('unlocks daily-7 at 7-day streak', () => {
      const checks = checkAchievements(
        {
          mode: 'daily',
          correct: true,
          streak: 1,
          maxStreak: 1,
          comboMultiplier: 1,
          totalCorrect: 1,
          level: 1,
          maxTableStars: 0,
          dailyStreak: 7,
        },
        emptyProgress,
        emptyUnlocked
      )
      expect(checks.some((c) => c.id === 'daily-7')).toBe(true)
    })

    it('unlocks level-10 at level 10', () => {
      const checks = checkAchievements(
        {
          mode: 'practice',
          correct: true,
          streak: 1,
          maxStreak: 1,
          comboMultiplier: 1,
          totalCorrect: 1,
          level: 10,
          maxTableStars: 0,
          dailyStreak: 0,
        },
        emptyProgress,
        emptyUnlocked
      )
      expect(checks.some((c) => c.id === 'level-10')).toBe(true)
    })

    it('doesnt duplicate unlocked achievements', () => {
      const unlocked = new Set(['first-answer'])
      const checks = checkAchievements(
        {
          mode: 'practice',
          correct: true,
          streak: 1,
          maxStreak: 1,
          comboMultiplier: 1,
          totalCorrect: 1,
          level: 1,
          maxTableStars: 0,
          dailyStreak: 0,
        },
        emptyProgress,
        unlocked
      )
      expect(checks.some((c) => c.id === 'first-answer')).toBe(false)
    })
  })
})
