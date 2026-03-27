import { Achievement, GameMode, TableProgress } from '@/types'

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-answer',
    title: 'First Steps',
    description: 'Answer your first question correctly',
    icon: '🎯',
  },
  {
    id: 'streak-3',
    title: 'On a Roll',
    description: 'Get 3 questions right in a row',
    icon: '🔥',
  },
  {
    id: 'streak-10',
    title: 'On Fire',
    description: 'Get 10 questions right in a row',
    icon: '🌟',
  },
  {
    id: 'table-master',
    title: 'Table Master',
    description: 'Earn 5 stars on any multiplication table',
    icon: '⭐',
  },
  {
    id: 'combo-5x',
    title: 'Ultimate Combo',
    description: 'Build a 5x combo multiplier',
    icon: '💥',
  },
  {
    id: 'practice-50',
    title: 'Practice Makes Perfect',
    description: 'Complete 50 Practice mode questions',
    icon: '📚',
  },
  {
    id: 'speedrun-beat',
    title: 'Speed Racer',
    description: 'Complete a Speed Run round',
    icon: '⚡',
  },
  {
    id: 'survival-10',
    title: 'Survivor',
    description: 'Survive 10 rounds in Survival mode',
    icon: '💪',
  },
  {
    id: 'boss-slayer',
    title: 'Boss Slayer',
    description: 'Defeat a Boss',
    icon: '⚔️',
  },
  {
    id: 'all-bosses',
    title: 'Dragon Slayer',
    description: 'Defeat all 11 table bosses',
    icon: '🐉',
  },
  {
    id: 'daily-1',
    title: 'Daily Ritual',
    description: 'Complete Daily Challenge',
    icon: '📅',
  },
  {
    id: 'daily-7',
    title: 'Week Warrior',
    description: 'Achieve 7-day Daily streak',
    icon: '📆',
  },
  {
    id: 'daily-30',
    title: 'Monthly Legend',
    description: 'Achieve 30-day Daily streak',
    icon: '🏆',
  },
  {
    id: 'level-10',
    title: 'Level 10',
    description: 'Reach level 10',
    icon: '📈',
  },
  {
    id: 'explorer-master',
    title: 'Visual Learner',
    description: 'Use Table Explorer on all tables',
    icon: '🎨',
  },
  {
    id: 'combo-100',
    title: 'Unstoppable',
    description: 'Get 100 combos in a single session',
    icon: '🚀',
  },
  {
    id: 'perfect-daily',
    title: 'Perfect Day',
    description: 'Score 100% on Daily Challenge',
    icon: '🎪',
  },
  {
    id: 'all-themes',
    title: 'Chromatic',
    description: 'Use all 4 themes',
    icon: '🎭',
  },
  {
    id: 'impossible',
    title: 'Impossible?',
    description: 'Beat the toughest 12×14 question',
    icon: '🤯',
  },
]

export interface AchievementCheck {
  id: string
  shouldUnlock: boolean
}

export function checkAchievements(
  stats: {
    mode: GameMode
    correct: boolean
    streak: number
    maxStreak: number
    comboMultiplier: number
    totalCorrect: number
    level: number
    maxTableStars: number
    dailyStreak: number
    dailyScore?: number
    bossDefeated?: boolean
    a?: number
    b?: number
  },
  progress: Record<number, Partial<TableProgress>>,
  unlockedAchievements: Set<string>
): AchievementCheck[] {
  const checks: AchievementCheck[] = []

  // First answer
  if (stats.correct && !unlockedAchievements.has('first-answer') && stats.totalCorrect === 1) {
    checks.push({ id: 'first-answer', shouldUnlock: true })
  }

  // Streaks
  if (!unlockedAchievements.has('streak-3') && stats.streak >= 3) {
    checks.push({ id: 'streak-3', shouldUnlock: true })
  }
  if (!unlockedAchievements.has('streak-10') && stats.streak >= 10) {
    checks.push({ id: 'streak-10', shouldUnlock: true })
  }

  // Table master (5 stars)
  if (!unlockedAchievements.has('table-master') && stats.maxTableStars >= 5) {
    checks.push({ id: 'table-master', shouldUnlock: true })
  }

  // Combo
  if (!unlockedAchievements.has('combo-5x') && stats.comboMultiplier >= 5) {
    checks.push({ id: 'combo-5x', shouldUnlock: true })
  }

  // Practice mode
  if (!unlockedAchievements.has('practice-50') && stats.totalCorrect >= 50) {
    checks.push({ id: 'practice-50', shouldUnlock: true })
  }

  // Speed run
  if (!unlockedAchievements.has('speedrun-beat') && stats.mode === 'speedrun' && stats.correct) {
    checks.push({ id: 'speedrun-beat', shouldUnlock: true })
  }

  // Survival
  if (
    !unlockedAchievements.has('survival-10') &&
    stats.mode === 'survival' &&
    stats.maxStreak >= 10
  ) {
    checks.push({ id: 'survival-10', shouldUnlock: true })
  }

  // Boss
  if (!unlockedAchievements.has('boss-slayer') && stats.bossDefeated) {
    checks.push({ id: 'boss-slayer', shouldUnlock: true })
  }

  // All bosses defeated
  const allBossesDefeated = Object.values(progress).every((p) => p.bossDefeated)
  if (!unlockedAchievements.has('all-bosses') && allBossesDefeated) {
    checks.push({ id: 'all-bosses', shouldUnlock: true })
  }

  // Daily challenges
  if (!unlockedAchievements.has('daily-1') && stats.mode === 'daily' && stats.correct) {
    checks.push({ id: 'daily-1', shouldUnlock: true })
  }
  if (!unlockedAchievements.has('daily-7') && stats.dailyStreak >= 7) {
    checks.push({ id: 'daily-7', shouldUnlock: true })
  }
  if (!unlockedAchievements.has('daily-30') && stats.dailyStreak >= 30) {
    checks.push({ id: 'daily-30', shouldUnlock: true })
  }

  // Level 10
  if (!unlockedAchievements.has('level-10') && stats.level >= 10) {
    checks.push({ id: 'level-10', shouldUnlock: true })
  }

  // Perfect daily
  if (
    !unlockedAchievements.has('perfect-daily') &&
    stats.mode === 'daily' &&
    stats.dailyScore === 100
  ) {
    checks.push({ id: 'perfect-daily', shouldUnlock: true })
  }

  // Impossible (12×14)
  if (
    !unlockedAchievements.has('impossible') &&
    stats.correct &&
    stats.a === 12 &&
    stats.b === 14
  ) {
    checks.push({ id: 'impossible', shouldUnlock: true })
  }

  return checks
}
