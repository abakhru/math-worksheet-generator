import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TableProgress } from '@/types'

interface ProgressStore {
  progress: Record<number, TableProgress>
  achievements: Record<string, number> // achievementId -> timestamp
  dailyMedals: Record<string, number> // dateStr -> timestamp (1 per day max)
  initializeProgress: () => void
  updateTableProgress: (table: number, updates: Partial<TableProgress>) => void
  addMasteryPoints: (table: number, points: number) => void
  unlockAchievement: (achievementId: string) => void
  addDailyMedal: (dateStr: string) => void
  getDailyStreak: () => number
  getUnlockedAchievements: () => string[]
}

const ALL_TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const initializeAllTables = (): Record<number, TableProgress> => {
  const progress: Record<number, TableProgress> = {}
  ALL_TABLES.forEach((table) => {
    progress[table] = {
      table,
      masteryPoints: 0,
      stars: 0,
      bossDefeated: false,
      stats: {
        attempted: 0,
        correct: 0,
        streak: 0,
        maxStreak: 0,
      },
    }
  })
  return progress
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: initializeAllTables(),
      achievements: {},
      dailyMedals: {},

      initializeProgress: () => {
        set({
          progress: initializeAllTables(),
          achievements: {},
          dailyMedals: {},
        })
      },

      updateTableProgress: (table: number, updates: Partial<TableProgress>) => {
        set((state) => ({
          progress: {
            ...state.progress,
            [table]: {
              ...state.progress[table],
              ...updates,
            },
          },
        }))
      },

      addMasteryPoints: (table: number, points: number) => {
        set((state) => {
          const current = state.progress[table]
          const newPoints = current.masteryPoints + points

          // Calculate stars (0-5 stars, 200 points per star)
          let stars = 0
          if (newPoints >= 200) stars = 1
          if (newPoints >= 400) stars = 2
          if (newPoints >= 600) stars = 3
          if (newPoints >= 800) stars = 4
          if (newPoints >= 1000) stars = 5

          return {
            progress: {
              ...state.progress,
              [table]: {
                ...current,
                masteryPoints: newPoints,
                stars,
              },
            },
          }
        })
      },

      unlockAchievement: (achievementId: string) => {
        set((state) => {
          if (state.achievements[achievementId]) return state
          return {
            achievements: {
              ...state.achievements,
              [achievementId]: Date.now(),
            },
          }
        })
      },

      addDailyMedal: (dateStr: string) => {
        set((state) => {
          return {
            dailyMedals: {
              ...state.dailyMedals,
              [dateStr]: Date.now(),
            },
          }
        })
      },

      getDailyStreak: () => {
        const { dailyMedals } = get()
        const today = new Date()
        let streak = 0

        for (let i = 0; i < 365; i++) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          const dateStr = date.toISOString().split('T')[0]
          if (dailyMedals[dateStr] !== undefined) {
            streak++
          } else {
            break
          }
        }

        return streak
      },

      getUnlockedAchievements: () => {
        const { achievements } = get()
        return Object.keys(achievements)
      },
    }),
    {
      name: 'mg_progress',
      version: 1,
    }
  )
)
