import { GameMode } from '@/types'

// Points earned per correct answer, depends on mode difficulty
export function getBasePoints(mode: GameMode, table: number): number {
  const tableFactor = Math.min(table / 12, 1) // 2-12 tables, scale 0.17-1
  const modeMultiplier: Record<GameMode, number> = {
    practice: 10,
    explorer: 5,
    daily: 15,
    speedrun: 20,
    survival: 25,
    boss: 30,
  }
  return Math.round(modeMultiplier[mode] * (0.8 + tableFactor * 0.2))
}

// XP calculation
export function calculateXP(points: number, comboMultiplier: number): number {
  return Math.round(points * (1 + comboMultiplier * 0.1))
}

// Mastery points per table (cumulative toward stars)
// 5 stars = 1000 points
export function masteryStars(points: number): number {
  if (points < 200) return 0
  if (points < 400) return 1
  if (points < 600) return 2
  if (points < 800) return 3
  if (points < 1000) return 4
  return 5
}

// Combo multiplier logic
export function updateCombo(correct: boolean, current: number): number {
  if (!correct) return 0
  const next = current + 1
  return Math.min(next, 5) // Capped at 5x
}

// Streak logic
export function updateStreak(correct: boolean, current: number): number {
  if (!correct) return 0
  return current + 1
}

// Daily streak (consecutive days with at least 1 medal)
export function calculateDailyStreak(medalsByDate: Record<string, number>): number {
  const today = new Date()
  let streak = 0

  for (let i = 0; i < 365; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    if (medalsByDate[dateStr] !== undefined) {
      streak++
    } else {
      break
    }
  }

  return streak
}

// Level calculation from total XP
export function calculateLevel(totalXP: number): number {
  // XP curve: 100, 300, 600, 1000, 1500, ...
  let level = 1
  let xpRequired = 100
  let accumulatedXP = 0

  while (accumulatedXP + xpRequired <= totalXP) {
    accumulatedXP += xpRequired
    level++
    xpRequired = Math.round(100 * level * 0.75)
  }

  return level
}

// XP needed for next level
export function xpToNextLevel(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP)
  let xpRequired = 100
  let accumulatedXP = 0

  for (let i = 1; i < currentLevel; i++) {
    xpRequired = Math.round(100 * i * 0.75)
    accumulatedXP += xpRequired
  }

  const nextXpRequired = Math.round(100 * currentLevel * 0.75)
  return accumulatedXP + nextXpRequired - totalXP
}

// Timer adjustments (Speed Run)
export function adjustTime(correct: boolean, timeRemaining: number): number {
  if (correct) {
    return Math.min(timeRemaining + 2, 60)
  } else {
    return Math.max(timeRemaining - 3, 0)
  }
}

// Speed Run score
export function calculateSpeedRunScore(
  questionsAnswered: number,
  correctAnswers: number,
  timeUsed: number
): number {
  const accuracy = correctAnswers / questionsAnswered
  const timeBonus = Math.max(0, 60 - timeUsed)
  return Math.round(correctAnswers * 100 + accuracy * 50 + timeBonus)
}

// Survival score
export function calculateSurvivalScore(
  questionsAnswered: number,
  maxStreak: number,
  bossesBeat: number
): number {
  return questionsAnswered * 10 + maxStreak * 25 + bossesBeat * 100
}

// Boss HP damage
export function bossDamage(combo: number): number {
  return Math.min(1 + combo, 4) // 1-4 HP per hit, scaled by combo
}
