import { describe, it, expect } from 'vitest'
import {
  isTableUnlocked,
  getUnlockedTables,
  getNextTableToUnlock,
  isModeUnlocked,
  canFightBoss,
  getMasteryInfo,
} from '@/engine/mastery'

const ALL_TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

describe('mastery engine', () => {
  describe('isTableUnlocked', () => {
    it('always unlocks tables 2, 5, 10', () => {
      const emptyProgress = {}
      expect(isTableUnlocked(2, emptyProgress)).toBe(true)
      expect(isTableUnlocked(5, emptyProgress)).toBe(true)
      expect(isTableUnlocked(10, emptyProgress)).toBe(true)
    })

    it('requires previous table at 2 stars', () => {
      const progress = {
        2: { stars: 1 },
      }
      expect(isTableUnlocked(3, progress)).toBe(false)

      progress[2].stars = 2
      expect(isTableUnlocked(3, progress)).toBe(true)
    })

    it('unlocks tables sequentially', () => {
      const progress: Record<number, any> = {
        2: { stars: 2 },
        3: { stars: 1 },
      }
      expect(isTableUnlocked(3, progress)).toBe(true)
      expect(isTableUnlocked(4, progress)).toBe(false)

      progress[3].stars = 2
      expect(isTableUnlocked(4, progress)).toBe(true)
    })
  })

  describe('getUnlockedTables', () => {
    it('returns always-unlocked tables initially', () => {
      const unlocked = getUnlockedTables({})
      expect(unlocked).toContain(2)
      expect(unlocked).toContain(5)
      expect(unlocked).toContain(10)
    })

    it('includes unlocked tables based on progress', () => {
      const progress = {
        2: { stars: 2 },
        3: { stars: 2 },
        4: { stars: 1 },
      }
      const unlocked = getUnlockedTables(progress)
      expect(unlocked).toContain(2)
      expect(unlocked).toContain(3)
      expect(unlocked).toContain(4)
    })
  })

  describe('getNextTableToUnlock', () => {
    it('returns null when all tables unlocked', () => {
      const progress: Record<number, any> = {}
      ALL_TABLES.forEach((t, i) => {
        if (i === 0) {
          progress[t] = { stars: 2 }
        } else {
          progress[t] = { stars: 2 }
        }
      })
      expect(getNextTableToUnlock(progress)).toBeNull()
    })

    it('returns next locked table', () => {
      const progress: Record<number, any> = {
        2: { stars: 2 },
        5: { stars: 0 }, // Mark 5 as unlocked but not progressed
        10: { stars: 0 }, // Mark 10 as unlocked but not progressed
      }
      // Next should be table 3 (after 2, before 5)
      const next = getNextTableToUnlock(progress)
      expect(next).toBe(3)
    })

    it('skips always-unlocked tables in sequence', () => {
      const progress: Record<number, any> = {
        2: { stars: 2 },
        3: { stars: 2 },
        4: { stars: 2 },
        5: { stars: 0 }, // Always unlocked
        10: { stars: 0 }, // Always unlocked
      }
      // Next after 4 should be 6 (5 is always unlocked)
      const next = getNextTableToUnlock(progress)
      expect(next).toBe(6)
    })
  })

  describe('isModeUnlocked', () => {
    it('always unlocks practice, explorer, daily', () => {
      expect(isModeUnlocked('practice', 1, 0)).toBe(true)
      expect(isModeUnlocked('explorer', 1, 0)).toBe(true)
      expect(isModeUnlocked('daily', 1, 0)).toBe(true)
    })

    it('unlocks speedrun at level 3', () => {
      expect(isModeUnlocked('speedrun', 2, 0)).toBe(false)
      expect(isModeUnlocked('speedrun', 3, 0)).toBe(true)
    })

    it('unlocks survival at level 5', () => {
      expect(isModeUnlocked('survival', 4, 0)).toBe(false)
      expect(isModeUnlocked('survival', 5, 0)).toBe(true)
    })

    it('unlocks boss at 3 stars on any table', () => {
      expect(isModeUnlocked('boss', 1, 2)).toBe(false)
      expect(isModeUnlocked('boss', 1, 3)).toBe(true)
    })
  })

  describe('canFightBoss', () => {
    it('requires 3+ stars on table', () => {
      expect(canFightBoss(2)).toBe(false)
      expect(canFightBoss(3)).toBe(true)
      expect(canFightBoss(5)).toBe(true)
    })
  })

  describe('getMasteryInfo', () => {
    it('returns 0 stars below 200 points', () => {
      const info = getMasteryInfo(2, 100)
      expect(info.stars).toBe(0)
    })

    it('returns progress percentage', () => {
      const info = getMasteryInfo(2, 100)
      expect(info.progress).toBeGreaterThanOrEqual(0)
      expect(info.progress).toBeLessThanOrEqual(100)
    })

    it('returns next star threshold', () => {
      const info = getMasteryInfo(2, 100)
      expect(info.nextStar).toBeGreaterThan(0)
    })

    it('progress is 100 at max stars', () => {
      const info = getMasteryInfo(2, 1000)
      expect(info.stars).toBe(5)
      expect(info.progress).toBe(100)
    })

    it('tracks progression toward next star', () => {
      const info1 = getMasteryInfo(2, 100)
      const info2 = getMasteryInfo(2, 300)
      expect(info2.progress).toBeGreaterThan(info1.progress)
    })
  })
})
