// Game modes
export type GameMode = 'practice' | 'explorer' | 'daily' | 'speedrun' | 'survival' | 'boss'

// Question & answer
export interface Question {
  a: number
  b: number
  answer: number
  table: number
  mode: GameMode
}

export interface MultipleChoiceQuestion extends Question {
  choices: number[]
  correctIndex: number
}

// Player state
export interface Player {
  id: string
  name: string
  avatarId: number
  themeId: 'candy' | 'space' | 'jungle' | 'underwater'
  level: number
  totalXP: number
  settings: {
    soundEnabled: boolean
    hapticEnabled: boolean
    inputMode: 'multiple-choice' | 'numeric'
  }
}

// Per-table progress
export interface TableProgress {
  table: number
  masteryPoints: number
  stars: number
  bossDefeated: boolean
  stats: {
    attempted: number
    correct: number
    streak: number
    maxStreak: number
  }
}

// Achievements
export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: number // timestamp
}

// Session state (not persisted)
export interface SessionState {
  mode: GameMode
  currentTable: number
  questionsAnswered: number
  correctAnswers: number
  streak: number
  comboMultiplier: number
  timeRemaining: number
  lives: number
  bossHP: number
}

// Daily challenge
export interface DailyChallenge {
  date: string
  questions: Question[]
  answered: boolean
  score: number
}

// Leaderboard entry
export interface LeaderboardEntry {
  playerId: string
  playerName: string
  mode: GameMode
  score: number
  table?: number
  timestamp: number
}
