import { GameMode, TableProgress } from '@/types'

const ALL_TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

// Tables that are always available
const ALWAYS_UNLOCKED = [2, 5, 10]

// Unlock requirement: previous table at 2+ stars
export function isTableUnlocked(table: number, progress: Record<number, Partial<TableProgress>>): boolean {
  if (ALWAYS_UNLOCKED.includes(table)) return true

  const tableIndex = ALL_TABLES.indexOf(table)
  if (tableIndex <= 0) return false

  const previousTable = ALL_TABLES[tableIndex - 1]
  const prevProgress = progress[previousTable]
  return (prevProgress?.stars ?? 0) >= 2
}

// Get all unlocked tables
export function getUnlockedTables(progress: Record<number, Partial<TableProgress>>): number[] {
  return ALL_TABLES.filter((t) => isTableUnlocked(t, progress))
}

// Get next table to unlock
export function getNextTableToUnlock(progress: Record<number, Partial<TableProgress>>): number | null {
  const unlockedCount = getUnlockedTables(progress).length
  if (unlockedCount >= ALL_TABLES.length) return null
  return ALL_TABLES[unlockedCount]
}

// Mode unlock requirements
export function isModeUnlocked(mode: GameMode, level: number, maxTableStars: number): boolean {
  switch (mode) {
    case 'practice':
    case 'explorer':
    case 'daily':
      return true
    case 'speedrun':
      return level >= 3
    case 'survival':
      return level >= 5
    case 'boss':
      return maxTableStars >= 3
  }
}

// Boss unlock per table (3+ stars on that table)
export function canFightBoss(tableStars: number): boolean {
  return tableStars >= 3
}

// All-mode mastery
export function getMasteryInfo(
  table: number,
  masteryPoints: number
): {
  points: number
  stars: number
  progress: number // 0-100%
  nextStar: number // XP needed for next star
} {
  const starThresholds = [0, 200, 400, 600, 800, 1000]
  let stars = 0
  let nextStarThreshold = 200

  for (let i = 0; i < starThresholds.length - 1; i++) {
    if (masteryPoints >= starThresholds[i + 1]) {
      stars = i + 1
      nextStarThreshold = starThresholds[i + 2] || 1000
    } else {
      nextStarThreshold = starThresholds[i + 1]
      break
    }
  }

  const progress = Math.min((masteryPoints / nextStarThreshold) * 100, 100)
  const nextStar = Math.max(0, nextStarThreshold - masteryPoints)

  return {
    points: masteryPoints,
    stars,
    progress,
    nextStar,
  }
}
